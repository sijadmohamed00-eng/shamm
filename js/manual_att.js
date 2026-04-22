// ═══ MANUAL ATTENDANCE ═══
function adminManualAtt(){
  var empId=document.getElementById('manAttEmp').value;
  var date=document.getElementById('manAttDate').value;
  var ciTime=document.getElementById('manAttCiTime').value;
  var coTime=document.getElementById('manAttCoTime').value;
  if(!empId||!date){alert('حدد الموظف والتاريخ');return;}
  var rec={eid:empId,t:'ci',dt:date+'T'+ciTime,manual:true};
  saveAtt(rec);
  if(coTime){
    var rec2={eid:empId,t:'co',dt:date+'T'+coTime,manual:true};
    saveAtt(rec2);
  }
  document.getElementById('manAttFeedback').textContent='تم التسجيل بنجاح';
  document.getElementById('manAttFeedback').style.display='block';
  showToast('تم تسجيل الحضور','s');
}

function adminManualAttMulti(){}