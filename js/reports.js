// ═══ REPORTS ═══
function genAndSaveReport(){
  var reports=DB.get('reports')||[];
  reports.push({dt:new Date().toISOString(),by:'admin'});
  DB.set('reports',reports);
  showToast('تم حفظ التقرير','s');
}

function renderReportsList(){
  var reports=DB.get('reports')||[];
  var html='<div class="card"><div class="ch"><h3>التقارير المحفوظة</h3></div><div class="cb">';
  for(var i=0;i<reports.length;i++){
    html+='<div>'+new Date(reports[i].dt).toLocaleString('ar-IQ')+'</div>';
  }
  html+='</div></div>';
  document.getElementById('repList').innerHTML=html;
}