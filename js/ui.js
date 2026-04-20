// ═══ ui.js ═══
function startClock(){
  const t=setInterval(()=>{
    const now=new Date();
    const s=now.toLocaleTimeString('ar-IQ',{hour12:true,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    ['empClock','adminClock'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=s});
    // reset يومي ساعة 5:00:00 صباحاً
    if(now.getHours()===5&&now.getMinutes()===0&&now.getSeconds()===0){
      _dailyAttReset();
    }
    // smart alerts كل دقيقة
    if(now.getSeconds()===0)checkSmartAlerts();
  },1000);
  autoTimers.push(t);
}

// ── reset يومي للحضور ساعة 5 صباحاً ──
function _dailyAttReset(){
  const today=todayStr();
  const lastReset5=DB.get('lastReset5')||'';
  if(lastReset5===today)return; // نفّذ مرة واحدة فقط لكل يوم
  DB.set('lastReset5',today);

  // أرشفة الفترة إذا وصلنا لأول الشهر
  checkPeriodReset();

  // إشعار المدير بملخص الأمس
  const att=DB.get('att')||[];
  const emps=DB.get('emps')||[];
  // حساب أمس
  const yest=new Date(); yest.setDate(yest.getDate()-1);
  const yestStr=yest.toISOString().split('T')[0];
  const presYest=emps.filter(e=>att.some(a=>a.eid===e.id&&a.date===yestStr&&a.type==='ci'));
  const absYest=emps.filter(e=>!att.some(a=>a.eid===e.id&&a.date===yestStr&&a.type==='ci'));

  // بناء تقرير الأمس + إرسال لتليجرام
  let msg=`🌅 تقرير نهاية اليوم — ${fmtD(yestStr)}\n`;
  msg+=`━━━━━━━━━━━━━━━\n`;
  msg+=`✅ حضروا (${presYest.length}): ${presYest.map(e=>e.name).join('، ')||'—'}\n`;
  msg+=`❌ غابوا (${absYest.length}): ${absYest.map(e=>e.name).join('، ')||'—'}\n`;
  absYest.forEach(e=>{
    // تسجيل غياب تلقائي (بدون تسجيل حضور)
    // لا نضيف سجل غياب في att — فقط يُحسب من غياب الحضور
    // يمكن إضافة علامة غياب للمدير
  });
  msg+=`━━━━━━━━━━━━━━━\n⏰ سيبدأ دوام ${fmtD(today)} بعد قليل`;
  sendTg(msg);
  saveReportToArchive(msg,'auto');

  // إشعار في الواجهة إذا كان المدير مسجلاً
  if(CU?.role==='admin'){
    showToast(`🌅 Reset يومي — ${absYest.length} غائب أمس، ${presYest.length} حضروا`,'i');
    renderAdmin();
  }
  console.log('✅ Daily reset done at 5AM —',today);
}



// ═══════════════════════════════════════════════════
//  GPS
// ═══════════════════════════════════════════════════
let _gpsWatchId=null;
let _autoCoEnabled=true; // الانصراف التلقائي مُفعَّل افتراضياً
const AUTO_CO_DIST=750; // متر

function startGPS(){
  checkGPS();
  startGPSWatch();
}

function startGPSWatch(){
  if(_gpsWatchId!==null)return; // لا تبدأ مرتين
  if(!navigator.geolocation)return;
  _gpsWatchId=navigator.geolocation.watchPosition(pos=>{
    uLat=pos.coords.latitude; uLng=pos.coords.longitude;
    const wl=getWorkLoc();
    const dist=calcDist(uLat,uLng,wl.lat,wl.lng);
    // تحديث GPS UI
    if(dist<=wl.rad){
      gpsOk=true;
      setGPSUI('ok',`✅ داخل نطاق العمل`,`المسافة: ${Math.round(dist)} م`);
      if(document.getElementById('ciSub'))document.getElementById('ciSub').textContent='موقعك مؤكد';
    }else{
      gpsOk=false;
      setGPSUI('fail',`📍 ${Math.round(dist)} م عن العمل`,`خارج نطاق تسجيل الحضور`);
      if(document.getElementById('ciSub'))document.getElementById('ciSub').textContent='خارج نطاق العمل';
    }
    updAttBtns();
    // ── الانصراف التلقائي عند المغادرة 750م ──
    if(_autoCoEnabled && CU?.role==='emp' && dist>=AUTO_CO_DIST){
      _tryAutoCheckout(dist);
    }
  },()=>{
    gpsOk=false;
    setGPSUI('fail','تعذّر تحديد الموقع','فعّل GPS');
    updAttBtns();
  },{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
}

let _autoCoLock=false; // منع التكرار
function _tryAutoCheckout(distMeters){
  if(_autoCoLock)return;
  const emp=getEmp(); if(!emp)return;
  const att=DB.get('att')||[];
  // هل هناك حضور مفتوح بدون انصراف؟
  const allCI=att.filter(a=>a.eid===emp.id&&a.type==='ci').sort((a,b)=>new Date(b.ts)-new Date(a.ts));
  const openCI=allCI.find(ci=>!att.find(co=>co.eid===emp.id&&co.type==='co'&&co.date===ci.date));
  if(!openCI)return; // لا يوجد دوام مفتوح
  // تأكد لم ينصرف خلال آخر 5 دقائق تفادياً للتكرار
  const lastCO=att.filter(a=>a.eid===emp.id&&a.type==='co').sort((a,b)=>new Date(b.ts)-new Date(a.ts))[0];
  if(lastCO&&(Date.now()-new Date(lastCO.ts).getTime())<300000)return;
  _autoCoLock=true;
  setTimeout(()=>_autoCoLock=false,60000); // unlock بعد دقيقة
  // تسجيل الانصراف التلقائي
  const now=new Date();
  const mins=Math.round((now-new Date(openCI.ts))/60000);
  const h=Math.floor(mins/60),m=mins%60;
  const wl=getWorkLoc();
  att.push({
    id:genId(),eid:emp.id,ename:emp.name,
    type:'co',date:openCI.date,time:fmtT(now),
    ts:now.toISOString(),lat:uLat,lng:uLng,
    dist:Math.round(distMeters),durMins:mins,
    isAuto:true // علامة أنه تلقائي
  });
  DB.set('att',att);
  addAdminLog('check_out',`انصراف تلقائي: ${emp.name} (${Math.round(distMeters)}م)`,{eid:emp.id,auto:true,dist:Math.round(distMeters)});
  updTodayStatus(emp.id); renderEmpHist(emp.id); renderDayGrid(emp.id); updAttBtns(); refreshEmpUI(emp);
  sendTg(`🚗 انصراف تلقائي\n👤 ${emp.name}\n🕐 ${fmtT(now)}\n📍 ${Math.round(distMeters)} م عن العمل\n⏱️ ${h}س ${m}د`);
  playNotifSound('out');
  showToast(`🚗 انصراف تلقائي — ابتعدت ${Math.round(distMeters)} م عن العمل`,'i');
}

