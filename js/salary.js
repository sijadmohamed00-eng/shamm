// ═══ SALARY CALC ═══
function calcSalary(empId){
  var emp=getEmpById(empId);
  if(!emp)return null;
  var att=getEmpAtt(empId);
  var base=emp.sal||0;
  var days=att.filter(function(a){return a.t==='ci';}).length;
  var daily=base/30;
  return {base:base,daily:daily,days:days,total:Math.round(daily*days)};
}

function exportSalaryPDF(empId){
  var s=calcSalary(empId);
  var emp=getEmpById(empId);
  var win=window.open('','_blank');
  win.document.write('<html><head><title>كشف الراتب</title></head><body>');
  win.document.write('<h1>كشف راتب - '+emp.name+'</h1>');
  win.document.write('<p>الراتب الاساسي: '+formatNum(s.base)+' د.ع</p>');
  win.document.write('<p>ايام الحضور: '+s.days+'</p>');
  win.document.write('<p>الاجمالي: '+formatNum(s.total)+' د.ع</p>');
  win.document.write('</body></html>');
  win.print();
}