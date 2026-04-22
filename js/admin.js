// ═══ ADMIN FUNCTIONS ═══
function renderAdmin(){
  document.getElementById('adminDateFull').textContent=new Date().toLocaleDateString('ar-IQ');
  renderEmpTable();
  renderStats();
}

function renderStats(){
  var emps=DB.get('emps')||[];
  document.getElementById('st-tot').textContent=emps.length;
  document.getElementById('adminEC').textContent=emps.length;
}

function renderEmpTable(){
  var emps=DB.get('emps')||[];
  var html='';
  for(var i=0;i<emps.length;i++){
    html+='<tr><td>'+(i+1)+'</td><td>'+emps[i].name+'</td><td>'+emps[i].u+'</td><td>'+(emps[i].shift||'')+'</td><td>'+formatNum(emps[i].sal||0)+'</td><td>--</td><td><button onclick="editEmp(\''+emps[i].id+'\')">✏️</button> <button onclick="delEmp(\''+emps[i].id+'\')">🗑️</button></td></tr>';
  }
  document.getElementById('empListTable').innerHTML=html||'<tr><td colspan="7">لا توجد موظفين</td></tr>';
  document.getElementById('empListCount').textContent=emps.length+' موظف';
}

function openAddEmp(){
  openModal('addEmpModal');
}

function addEmp(){
  var name=document.getElementById('newEmpName').value;
  var u=document.getElementById('newEmpU').value;
  var pw=document.getElementById('newEmpPw').value;
  var sal=parseInt(document.getElementById('newEmpSal').value)||0;
  var emp={id:'emp_'+Date.now(),name:name,u:u,pw:pw,sal:sal};
  saveEmp(emp);
  renderEmpTable();
  closeModal('addEmpModal');
  showToast('تم اضافة الموظف','s');
}

function editEmp(id){
  alert('تعديل: '+id);
}

var startTimers=function(){
  renderAdmin();
};