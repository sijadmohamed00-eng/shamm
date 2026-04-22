function loadEmpScreen(emp){
  console.log('loadEmpScreen called with emp:',emp);
  
  if(!emp){
    console.error('No emp data!');
    return;
  }
  
  // Set global CU for getEmp
  window.CU={role:'emp',id:emp.id};
  window.currentUser=emp;
  
  // Show photo if exists, otherwise first letter
  var av=document.getElementById('empAv');
  var avBig=document.getElementById('empAvBig');
  if(av){
    if(emp.photo){
      av.style.backgroundImage='url('+emp.photo+')';
      av.textContent='';
    } else {
      av.style.backgroundImage='';
      av.textContent=emp.name?emp.name.charAt(0):'م';
    }
  }
  if(avBig){
    if(emp.photo){
      avBig.style.backgroundImage='url('+emp.photo+')';
      avBig.style.backgroundSize='cover';
      avBig.style.backgroundPosition='center';
      avBig.textContent='';
    } else {
      avBig.style.backgroundImage='';
      avBig.style.backgroundSize='';
      avBig.textContent=emp.name?emp.name.charAt(0):'م';
    }
  }
  var nameBar=document.getElementById('empNameBar');
  if(nameBar)nameBar.textContent=emp.name||'--';
  var nameBadge=document.getElementById('empNameBadge');
  if(nameBadge)nameBadge.textContent=emp.name||'--';
  var welcome=document.getElementById('empWelcome');
  if(welcome)welcome.textContent='مرحباً،';
  var nb=document.getElementById('empNameBig');if(nb)nb.textContent=(emp.name||'--')+' 👋';
  var now=new Date();
  var dateBar=document.getElementById('empDateBar');
  if(dateBar)dateBar.textContent=now.toLocaleDateString('ar-IQ',{weekday:'long',month:'long',day:'numeric'});
  var welcomeSub=document.getElementById('empWelcomeSub');
  if(welcomeSub)welcomeSub.textContent=now.toLocaleDateString('ar-IQ',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  var shiftBar=document.getElementById('empShiftBar');
  if(shiftBar){
    if(typeof window.shiftLabel === 'function'){
      shiftBar.textContent='الشفت: '+window.shiftLabel(emp);
    } else {
      shiftBar.textContent='الشفت: '+(emp.sh||'--');
    }
  }
  try{refreshEmpUI(emp);}catch(e){console.error('refreshEmpUI error:',e);}
  try{updTodayStatus(emp.id);}catch(e){console.error('updTodayStatus error:',e);}
  try{renderEmpHist(emp.id);}catch(e){console.error('renderEmpHist error:',e);}
  try{renderDayGrid(emp.id);}catch(e){console.error('renderDayGrid error:',e);}
  try{renderEmpAttPattern(emp.id);}catch(e){console.error('renderEmpAttPattern error:',e);}
  try{updAttBtns();}catch(e){console.error('updAttBtns error:',e);}
  try{renderEmpMessages(emp.id);}catch(e){console.error('renderEmpMessages error:',e);}
  try{renderEmpArchive(emp.id);}catch(e){console.error('renderEmpArchive error:',e);}
  try{startClock();}catch(e){console.error('startClock error:',e);}
  // New v3/v4
  try{renderEmpLeaveHistory();}catch(e){}
  try{renderEmpLastAtt();}catch(e){}
  try{renderEmpChat();}catch(e){}
  try{requestBrowserNotif();}catch(e){}
  try{renderEmpLoanHistory();}catch(e){}
  setTimeout(function(){try{_startChatListener();}catch(e){}},1500);
}

function refreshEmpUI(emp){
  var c=calcSalary(emp);
  document.getElementById('es-net').textContent=fmtN(c.net);
  document.getElementById('es-pres').textContent=c.daysPresent;
  document.getElementById('es-abs').textContent=c.deductDays;
  document.getElementById('es-bon').textContent=fmtN(c.totalBon);
  document.getElementById('accBig').innerHTML=fmtN(c.net)+' <span style="font-size:14px;color:var(--t2)">د.ع</span>';
  document.getElementById('accSub2').textContent=c.daysPresent+' حضور + '+c.paidLeaves+' إجازة × '+fmtN(c.dailyRate)+' د.ع/يوم';
  document.getElementById('empPeriodLabel').textContent='الفترة: '+c.per.label;
  var pct=Math.min(100,Math.round(c.paidDays/c.per.totalDays*100));
  document.getElementById('accBar').style.width=pct+'%';
  document.getElementById('accS').textContent=c.per.start.toLocaleDateString('ar-IQ',{day:'numeric',month:'short'});
  document.getElementById('accE').textContent=c.per.end.toLocaleDateString('ar-IQ',{day:'numeric',month:'short'});
  document.getElementById('slipEmpName').textContent=emp.name+' — '+c.per.label;
  document.getElementById('empPBadge').textContent=c.per.label;
  document.getElementById('sl-monthly').textContent=fmtN(emp.sal)+' د.ع';
  document.getElementById('sl-daily').textContent=fmtN(c.dailyRate)+' د.ع';
  document.getElementById('sl-present').textContent=c.daysPresent+' يوم';
  document.getElementById('sl-paidleave').textContent=c.paidLeaves+' يوم';
  document.getElementById('sl-deductdays').textContent=(c.daysAbsent>0?c.daysAbsent+' غياب':'')+(c.daysAbsent>0&&c.deductLeaves>0?' + ':'')+(c.deductLeaves>0?c.deductLeaves+' إجازة زائدة':'')||'لا يوجد';
  document.getElementById('sl-earned').textContent=fmtN(c.earnedSalary)+' د.ع';
  document.getElementById('sl-shiftbon').textContent='+'+fmtN(c.shiftBonTotal)+' د.ع';
  document.getElementById('sl-salesbon').textContent='+'+fmtN(c.salesBonTotal)+' د.ع';
  document.getElementById('sl-otherbon').textContent='+'+fmtN(c.otherBonTotal)+' د.ع';
  document.getElementById('sl-ded').textContent='-'+fmtN(c.totalDed)+' د.ع';
  document.getElementById('sl-total').textContent=fmtN(c.net)+' د.ع';
}

// Show employee photo in admin panel
function renderEmpPhotoInAdmin(emp,containerId){
  var c=document.getElementById(containerId);
  if(!c)return;
  if(emp.photo){
    c.style.backgroundImage='url('+emp.photo+')';
    c.style.backgroundSize='cover';
    c.style.backgroundPosition='center';
    c.textContent='';
  } else {
    c.style.backgroundImage='';
    c.style.backgroundSize='';
    c.textContent=emp.name.charAt(0);
  }
}

var uLat=0,uLng=0;

function updTodayStatus(eid){
  var att=DB.get('att')||[];
  var t=document.getElementById('empTT1'), s=document.getElementById('empTSub1');
  if(!t)return;
  var allCI=att.filter(function(a){return a.eid===eid&&a.type==='ci';}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  var lastCI=allCI[0];
  if(!lastCI){
    t.textContent='⚪ لم تسجل حضوراً بعد';
    s.textContent='اضغط تسجيل الحضور لبدء دوامك';
    return;
  }
  var co=att.find(function(a){return a.eid===eid&&a.type==='co'&&a.date===lastCI.date;});
  if(co){
    var mins=co.durMins||0;
    var h=Math.floor(mins/60),m=mins%60;
    var warningTxt=mins<240?' ⚠️ (أقل من 4 ساعات)':'';
    t.textContent='✅ تم تسجيل الانصراف'+warningTxt;
    s.textContent='📅 '+fmtD(lastCI.date)+' | حضور: '+lastCI.time+' | انصراف: '+co.time+' | المدة: '+h+'س '+m+'د';
    t.style.color=mins<240?'var(--red)':'var(--green)';
  } else {
    var now=new Date();
    var mins=Math.round((now-new Date(lastCI.ts))/60000);
    var h=Math.floor(mins/60),m=mins%60;
    t.textContent='🟢 مسجل الحضور الآن';
    t.style.color='var(--green)';
    s.textContent='📅 '+fmtD(lastCI.date)+' | حضور: '+lastCI.time+' | مدة الدوام: '+h+'س '+m+'د';
  }
}

function updAttBtns(){
  var emp=getEmp(); if(!emp)return;
  var sd=shiftDateStr(), att=DB.get('att')||[];
  var ci=att.find(function(a){return a.eid===emp.id&&a.date===sd&&a.type==='ci';});
  var openCI=att.filter(function(a){return a.eid===emp.id&&a.type==='ci';}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);}).find(function(c){return !att.find(function(co){return co.eid===emp.id&&co.type==='co'&&co.date===c.date;});});
  var bci=document.getElementById('btnCI'), bco=document.getElementById('btnCO');
  if(bci)bci.disabled=(!!ci||!!openCI)||!gpsOk;
  if(bco)bco.disabled=!openCI;
}

// ═══ SHIFT-AWARE DATE
function shiftDateStr(){
  var now=new Date();
  var h=now.getHours();
  if(h<11){
    var d=new Date(now); d.setDate(d.getDate()-1);
    return d.toISOString().split('T')[0];
  }
  return now.toISOString().split('T')[0];
}

function doCI(){
  var emp=getEmp(); if(!emp)return;
  if(!gpsOk){showToast('يجب أن تكون في موقع العمل','e');return}
  var shiftDate=shiftDateStr(), att=DB.get('att')||[];
  if(att.find(function(a){return a.eid===emp.id&&a.date===shiftDate&&a.type==='ci';})){showToast('سجلت حضورك مسبقاً','e');return}
  var now=new Date();
  var wl=getWorkLoc();
  var dist=Math.round(calcDist(uLat,uLng,wl.lat,wl.lng));
  var rec={id:genId(),eid:emp.id,ename:emp.name,type:'ci',date:shiftDate,time:fmtT(now),ts:now.toISOString(),lat:uLat,lng:uLng,dist:dist};
  att.push(rec); DB.set('att',att);
  addAdminLog('check_in','تسجيل حضور: '+emp.name,{eid:emp.id,date:shiftDate,time:fmtT(now),dist:dist});
  updTodayStatus(emp.id); renderEmpHist(emp.id); renderDayGrid(emp.id); renderEmpAttPattern(emp.id); updAttBtns(); refreshEmpUI(emp);
  sendTg('✅ تسجيل حضور\n👤 '+emp.name+'\n🕐 '+fmtT(now)+'\n📅 '+fmtD(shiftDate)+'\n📍 '+dist+' متر');
  playNotifSound('in');
  showToast('✅ تم تسجيل الحضور — '+fmtT(now),'s');
}

function doCO(){
  var emp=getEmp(); if(!emp)return;
  var att=DB.get('att')||[];
  var allCI=att.filter(function(a){return a.eid===emp.id&&a.type==='ci';}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  var ci=allCI.find(function(ci2){return !att.find(function(co){return co.eid===emp.id&&co.type==='co'&&co.date===ci2.date;});});
  if(!ci){showToast('سجّل الحضور أولاً','e');return}
  var now=new Date();
  var mins=Math.round((now-new Date(ci.ts))/60000);
  var h=Math.floor(mins/60), m=mins%60;
  var wl=getWorkLoc();
  var dist=Math.round(calcDist(uLat||wl.lat,uLng||wl.lng,wl.lat,wl.lng));
  att.push({id:genId(),eid:emp.id,ename:emp.name,type:'co',date:ci.date,time:fmtT(now),ts:now.toISOString(),lat:uLat,lng:uLng,dist:dist,durMins:mins});
  DB.set('att',att);
  addAdminLog('check_out','تسجيل انصراف: '+emp.name,{eid:emp.id,date:ci.date,time:fmtT(now),durMins:mins});
  updTodayStatus(emp.id); renderEmpHist(emp.id); renderDayGrid(emp.id); renderEmpAttPattern(emp.id); updAttBtns(); refreshEmpUI(emp);
  sendTg('🚪 تسجيل انصراف\n👤 '+emp.name+'\n🕐 '+fmtT(now)+'\n📅 '+fmtD(ci.date)+'\n⏱️ '+h+'س '+m+'د');
  playNotifSound('out');
  showToast('🚪 تم تسجيل الانصراف — '+h+'س '+m+'د','i');
}

function toggleAutoCo(){
  _autoCoEnabled=!_autoCoEnabled;
  var btn=document.getElementById('autoCoBtn');
  if(btn){
    btn.textContent=_autoCoEnabled?'🚗 تلقائي':'🚗 موقوف';
    btn.style.color=_autoCoEnabled?'var(--green)':'var(--red)';
  }
  showToast(_autoCoEnabled?'✅ الانصراف التلقائي مُفعَّل عند 750م':'⏸️ الانصراف التلقائي ميقاف',_autoCoEnabled?'s':'i');
}

function renderEmpHist(eid){
  var c=document.getElementById('empHL'); if(!c)return;
  var att=(DB.get('att')||[]).filter(function(a){return a.eid===eid;}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  c.innerHTML=att.length?att.map(function(a){return '<div class="hi"><div class="hic '+(a.type==='ci'?'in':'out')+'">'+(a.type==='ci'?'✅':a.isAuto?'🚗':'🚪')+'</div><div class="hinfo"><div class="htype">'+(a.type==='ci'?'تسجيل حضور':a.isAuto?'انصراف تلقائي 🚗':'تسجيل انصراف')+(a.type==='co'&&a.durMins?' — '+Math.floor(a.durMins/60)+'س '+a.durMins%60+'د':'')+'</div><div class="hdate">'+fmtD(a.date)+(a.isAuto&&a.dist?' • ابتعاد '+a.dist+'م':'')+'</div></div><div class="htime">'+a.time+'</div></div>';}).join(''):'<div class="empty"><div class="ei">📭</div><p>لا توجد سجلات</p></div>';
}

function renderDayGrid(eid){
  var c=document.getElementById('empDG'); if(!c)return;
  var att=DB.get('att')||[];
  var leaveDays=DB.get('leaveDays')||[];
  var per=getPeriod();
  var now=new Date();
  var monthStart=new Date(now.getFullYear(),now.getMonth(),1);
  var monthEnd=new Date(now.getFullYear(),now.getMonth()+1,0);
  var today=todayStr();
  var days=[];
  var cur=new Date(monthStart);
  while(cur<=monthEnd){
    var ds=cur.toISOString().split('T')[0];
    var future=ds>today;
    var hasCI=att.some(function(a){return a.eid===eid&&a.date===ds&&a.type==='ci';});
    var isLeave=leaveDays.some(function(l){return l.eid===eid&&l.date===ds;})||att.some(function(a){return a.eid===eid&&a.date===ds&&a.type==='leave';});
    var cls,title;
    if(future){cls='f';title=fmtD(ds);}
    else if(hasCI){cls='p';title='حضور — '+fmtD(ds);}
    else if(isLeave){cls='lv';title='إجازة — '+fmtD(ds);}
    else{cls='f';title=fmtD(ds);}
    days.push('<div class="dc '+cls+'" title="'+title+'">'+cur.getDate()+'</div>');
    cur.setDate(cur.getDate()+1);
  }
  c.innerHTML=days.join('');
}

function renderEmpAttPattern(eid){
  var c=document.getElementById('empAttPattern'); if(!c)return;
  var att=DB.get('att')||[];
  var leaveDays=DB.get('leaveDays')||[];
  var dots=[];
  var now=new Date(), y=now.getFullYear(), m=now.getMonth();
  var monthStart=new Date(y,m,1);
  var monthEnd=new Date(y,m+1,0);
  var today=new Date(); today.setHours(23,59,59);
  var cur=new Date(monthStart);
  while(cur<=monthEnd){
    var ds=cur.toISOString().split('T')[0];
    var future=cur>today;
    var has=att.some(function(a){return a.eid===eid&&a.date===ds&&a.type==='ci';});
    var isLeave=leaveDays.some(function(l){return l.eid===eid&&l.date===ds;})||att.some(function(a){return a.eid===eid&&a.date===ds&&a.type==='leave';});
    var cls=future?'future':has?'present':isLeave?'on-leave':'future';
    dots.push('<div class="att-dot '+cls+'" title="'+cur.toLocaleDateString('ar-IQ')+'">'+cur.getDate()+'</div>');
    cur.setDate(cur.getDate()+1);
  }
  c.innerHTML=dots.join('');
}

function renderEmpMessages(eid){
  var c=document.getElementById('empMsgList'); if(!c)return;
  var msgs=(DB.get('msg')||[]).filter(function(m){return m.eid===eid&&m.type!=='reply';}).sort(function(a,b){return new Date(b.ts)-new Date(a.ts);});
  if(!msgs.length){c.innerHTML='<div class="empty"><div class="ei">📭</div><p>لا توجد رسائل من المدير</p></div>';return;}
  var html='';
  msgs.forEach(function(m){
    html+='<div class="msg-item"><div class="msg-head"><div class="msg-avatar">👑</div><div><div class="msg-name" style="color:var(--gold)">المدير — سجاد محمد</div><div class="msg-time">'+fmtD(m.date)+' — '+m.time+'</div></div></div><div class="msg-text">'+m.text+'</div></div>';
  });
  c.innerHTML=html;
}

function renderEmpArchive(eid){
  var c=document.getElementById('empArchList'); if(!c)return;
  var archive=DB.get('archive')||{periods:[]};
  var periods=archive.periods.filter(function(p){return p.employees.some(function(e){return e.id===eid;});});
  if(!periods.length){c.innerHTML='<div class="empty"><div class="ei">🗄️</div><p>لا توجد فترات مؤرشفة بعد<br><small>ستُحفظ الفترات تلقائياً عند انتهائها</small></p></div>';return;}
  c.innerHTML=periods.map(function(per){
    var empData=per.employees.find(function(e){return e.id===eid;});
    if(!empData)return'';
    return '<div class="arch-period" onclick="showEmpArchDetail(\''+per.key+'\',\''+eid+'\')"><div class="arch-ph"><div><div style="font-size:14px;font-weight:700">'+per.label+'</div><div style="font-size:11px;color:var(--t2);margin-top:3px">يوم الصرف: '+fmtD(per.payDate)+'</div></div><div style="text-align:left"><div class="gnum" style="font-size:16px">'+fmtN(empData.net)+' د.ع</div><div style="font-size:11px;color:var(--t2)">'+empData.daysPresent+' يوم حضور</div></div></div></div>';
  }).join('');
}

function showEmpArchDetail(periodKey,eid){
  var archive=DB.get('archive')||{periods:[]};
  var per=archive.periods.find(function(p){return p.key===periodKey;}); if(!per)return;
  var emp=per.employees.find(function(e){return e.id===eid;}); if(!emp)return;
  document.getElementById('archDetailTitle').textContent='أرشيف: '+per.label;
  document.getElementById('archDetailContent').innerHTML='<div class="slip"><div class="sliph"><h4>👑 ابن الشام — '+per.label+'</h4><p>'+emp.name+'</p></div><div class="srow"><div class="sl2">الراتب الشهري</div><div class="sv2 gnum">'+fmtN(emp.sal)+' د.ع</div></div><div class="srow"><div class="sl2">أيام الحضور</div><div class="sv2 tgrn">'+emp.daysPresent+' يوم</div></div><div class="srow grn"><div class="sl2">الراتب المكتسب</div><div class="sv2">'+fmtN(emp.earnedSalary)+' د.ع</div></div><div class="srow grn"><div class="sl2">مكافآت الشفتات</div><div class="sv2">+'+fmtN(emp.shiftBonTotal)+' د.ع</div></div><div class="srow grn"><div class="sl2">حوافز المبيعات</div><div class="sv2">+'+fmtN(emp.salesBonTotal)+' د.ع</div></div><div class="srow grn"><div class="sl2">حوافز أخرى</div><div class="sv2">+'+fmtN(emp.otherBonTotal)+' د.ع</div></div><div class="srow ded"><div class="sl2">الخصومات</div><div class="sv2">-'+fmtN(emp.totalDed)+' د.ع</div></div><div class="divider"></div><div class="srow tot"><div class="sl2">💰 الإجمالي</div><div class="sv2">'+fmtN(emp.net)+' د.ع</div></div></div>';
  openModal('archDetailModal');
}

function showETab(id,el){
  document.querySelectorAll('#empScreen .tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('#empScreen .mnav-item').forEach(function(s){s.classList.remove('active');});
  document.querySelectorAll('#empSidebar .sitem').forEach(function(s){s.classList.remove('active');});
  var tabEl=document.getElementById('et-'+id);
  if(tabEl)tabEl.classList.add('active');
  if(el)el.classList.add('active');
  var emp=getEmp(); if(emp)refreshEmpUI(emp);
  if(id==='schedule'){renderEmpSchedule();}
  if(id==='chat'){renderEmpChat();setTimeout(function(){var c=document.getElementById('empChatMessages');if(c)c.scrollTop=c.scrollHeight;},100);}
  if(id==='msg'&&emp)renderEmpMessages(emp.id);
  if(id==='leave'&&emp)renderEmpLeaveHistory();
  if(id==='delatt')renderEmpLastAtt();
  if(id==='loan')renderEmpLoanHistory();
  document.getElementById('empMainScroll')?.scrollTo(0,0);
}

// Export ALL functions to window for global access
(function(){
  var funcs = [
    'loadEmpScreen','refreshEmpUI','updTodayStatus','updAttBtns',
    'doCI','doCO','toggleAutoCo','renderEmpHist','renderDayGrid',
    'renderEmpAttPattern','renderEmpMessages','renderEmpArchive',
    'showETab','showEmpArchDetail','renderEmpLeaveHistory','renderEmpLastAtt',
    'renderEmpChat','renderEmpLoanHistory','renderEmpSchedule'
  ];
  funcs.forEach(function(f){
    try{
      if(typeof window[f] === 'undefined' && typeof eval(f) === 'function'){
        window[f] = eval(f);
      }
    }catch(e){}
  });
})();