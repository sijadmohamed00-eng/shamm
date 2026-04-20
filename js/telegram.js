// ═══ telegram.js ═══
function buildReportText(type='manual'){
  const emps=DB.get('emps')||[], att=DB.get('att')||[], today=todayStr();
  const pres=emps.filter(e=>att.some(a=>a.eid===e.id&&a.date===today&&a.type==='ci'));
  const abs=emps.filter(e=>!att.some(a=>a.eid===e.id&&a.date===today&&a.type==='ci'));
  const per=getPeriod();
  const totalNet=emps.reduce((s,e)=>s+calcSalary(e).net,0);
  const now=new Date();
  let text=`━━━━━━━━━━━━━━━━━━━━━━\n👑 تقرير سندريلا — بغداد\n📅 ${now.toLocaleDateString('ar-IQ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}\n🕐 ${fmtT(now)}\n━━━━━━━━━━━━━━━━━━━━━━\n\n📊 ملخص:\n• الموظفون: ${emps.length} | الحاضرون: ${pres.length} | الغائبون: ${abs.length}\n\n`;
  if(pres.length){
    text+=`✅ الحاضرون (${pres.length}):\n`;
    pres.forEach(e=>{const ci=att.find(a=>a.eid===e.id&&a.date===today&&a.type==='ci');const co=att.find(a=>a.eid===e.id&&a.date===today&&a.type==='co');text+=`• ${e.name} [${shiftLabel(e)}] — حضور: ${ci?.time||'?'} | انصراف: ${co?co.time:'لم ينصرف'}\n`;});
    text+='\n';
  }
  if(abs.length){text+=`❌ الغائبون (${abs.length}):\n`;abs.forEach(e=>{text+=`• ${e.name}\n`;});text+='\n';}
  text+=`━━━━━━━━━━━━━━━━━━━━━━\n💰 الرواتب — ${per.label}\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  emps.forEach(e=>{const c=calcSalary(e);text+=`• ${e.name}: راتب ${fmtN(c.earnedSalary)} + حوافز ${fmtN(c.totalBon)} - خصم ${fmtN(c.totalDed)} = ${fmtN(c.net)} د.ع\n`;});
  text+=`\n💵 الإجمالي: ${fmtN(totalNet)} د.ع\n📆 الصرف: ${per.pay.toLocaleDateString('ar-IQ',{day:'numeric',month:'long'})}\n━━━━━━━━━━━━━━━━━━━━━━`;
  return text;
}

function saveReportToArchive(text,type='manual'){
  const reports=DB.get('reports')||[];
  const now=new Date();
  reports.unshift({id:genId(),text,date:todayStr(),time:fmtT(now),ts:now.toISOString(),type});
  if(reports.length>100)reports.length=100;
  DB.set('reports',reports);
  renderReportsList();
}

function genAndSaveReport(){
  const text=buildReportText('manual');
  saveReportToArchive(text,'manual');
  showToast('✅ تم حفظ التقرير','s');
}

function sendTgReport(){
  const text=buildReportText();
  sendTg(text);
  saveReportToArchive(text,'manual');
  showToast('📤 تم الإرسال لتليجرام','i');
}

function renderReportsList(){
  const c=document.getElementById('repList'); if(!c)return;
  const reports=DB.get('reports')||[];
  const rc=document.getElementById('repCount'), rl=document.getElementById('repLast');
  if(rc)rc.textContent=reports.length;
  if(rl)rl.textContent=reports.length?`${fmtD(reports[0].date)} ${reports[0].time}`:'--';
  c.innerHTML=reports.length?reports.map(r=>`
    <div class="report-item" onclick="viewReport('${r.id}')">
      <div class="rep-head"><div class="rep-title">📋 تقرير ${r.type==='auto'?'تلقائي':'يدوي'} — ${fmtD(r.date)}</div><div class="rep-date">${r.time}</div></div>
      <span class="rep-type ${r.type==='auto'?'rep-daily':'rep-manual'}">${r.type==='auto'?'تلقائي':'يدوي'}</span>
      <div style="font-size:11px;color:var(--t3);margin-top:6px;overflow:hidden;max-height:40px">${r.text.substring(0,100)}...</div>
    </div>`).join(''):`<div class="empty"><div class="ei">📋</div><p>لا توجد تقارير<br><small>تُرسل تلقائياً كل 4 صباحاً</small></p></div>`;
}

function viewReport(id){
  const rep=(DB.get('reports')||[]).find(r=>r.id===id); if(!rep)return;
  viewingReportId=id;
  document.getElementById('repViewContent').textContent=rep.text;
  openModal('repViewModal');
}

function sendSavedReportToTg(){
  const rep=(DB.get('reports')||[]).find(r=>r.id===viewingReportId);
  if(rep){sendTg(rep.text);showToast('📤 تم الإرسال','s');}
}

// ═══════════════════════════════════════════════════
//  ADD EMPLOYEE
// ═══════════════════════════════════════════════════
function handleShiftChange(prefix){
