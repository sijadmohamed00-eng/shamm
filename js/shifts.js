// ═══ SHIFTS ═══
function renderShiftSchedule(){
  var shifts=DB.get('dailyShifts')||{};
  var html='<div class="card"><div class="cb">';
  var days=['احد','اثنين','ثلاثاء','اربعا','خميس','جمعة','سبت'];
  for(var i=0;i<7;i++){
    html+='<div><strong>'+days[i]+':</strong> '+(shifts[i]||'لم يحدد')+'</div>';
  }
  html+='</div></div>';
  document.getElementById('shiftScheduleGrid').innerHTML=html;
}

function archiveShiftSchedule(){
  var arch=DB.get('shiftArchives')||[];
  arch.push({dt:new Date().toISOString(),shifts:DB.get('dailyShifts')});
  DB.set('shiftArchives',arch);
  showToast('تم ارشفة الجدول','s');
}

function openAddShiftModal(){}