// ═══ LEAVES ═══
function submitLeaveRequest(){
  var type=document.getElementById('leaveTypeEmp').value;
  var date=document.getElementById('leaveDateEmp').value;
  var reason=document.getElementById('leaveReasonEmp').value;
  if(!reason){alert('اكتب السبب');return;}
  var leaves=DB.get('leaveRequests')||[];
  leaves.push({empId:CU.id,type:type,date:date,reason:reason,dt:new Date().toISOString(),status:'pending'});
  DB.set('leaveRequests',leaves);
  showToast('تم ارسال الطلب','s');
}

function empReplyToManager(){
  var txt=document.getElementById('empReplyText').value;
  if(!txt){alert('اكتب الرد');return;}
  var msgs=DB.get('empToAdminMsg')||[];
  msgs.push({empId:CU.id,txt:txt,dt:new Date().toISOString()});
  DB.set('empToAdminMsg',msgs);
  showToast('تم الارسال','s');
}

function addLeaveDayAdmin(){}