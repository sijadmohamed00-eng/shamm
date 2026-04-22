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
    html+='<tr><td>'+(i+1)+'</td><td>'+emps[i].name+'</td><td>'+(emps[i].u||'')+'</td><td>'+(emps[i].shift||'')+'</td><td>'+formatNum(emps[i].sal||0)+'</td><td>--</td><td><button onclick="delEmp(\''+emps[i].id+'\')">🗑️</button></td></tr>';
  }
  document.getElementById('empListTable').innerHTML=html||'<tr><td colspan="7">لا توجد موظفين</td></tr>';
  document.getElementById('empListCount').textContent=emps.length+' موظف';
}

function openAddEmp(){
  var html='<div class="modal" id="addEmpModal" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);align-items:center;justify-content:center;z-index:9999">';
  html+='<div style="background:var(--bg2);padding:20px;border-radius:12px;max-width:400px;width:100%">';
  html+='<h3>➕ اضافة موظف جديد</h3>';
  html+='<div class="fg"><label>الاسم</label><input type="text" id="newEmpName" class="fi" placeholder="اسم الموظف"></div>';
  html+='<div class="fg"><label>اليوزر</label><input type="text" id="newEmpU" class="fi" placeholder="username"></div>';
  html+='<div class="fg"><label>كلمة المرور</label><input type="password" id="newEmpPw" class="fi" placeholder="******"></div>';
  html+='<div class="fg"><label>الراتب</label><input type="number" id="newEmpSal" class="fi" placeholder="500000"></div>';
  html+='<div class="fg"><label>الشفت</label><select id="newEmpShift" class="fi"><option value="14:00-02:00">6 م - 2 ل</option><option value="15:30-03:30">3:30 م - 3:30 ص</option><option value="18:00-02:00">6 م - 2 ل (8س)</option><option value="19:00-03:00">7 م - 3 ص</option></select></div>';
  html+='<div style="display:flex;gap:10px;margin-top:15px">';
  html+='<button class="btn btn-sc" onclick="closeAddEmpModal()">الغاء</button>';
  html+='<button class="btn btn-pr" onclick="addEmp()">➕ اضافة</button>';
  html+='</div></div></div>';
  document.body.insertAdjacentHTML('beforeend',html);
}

function closeAddEmpModal(){
  var m=document.getElementById('addEmpModal');
  if(m){m.remove();}
}

function addEmp(){
  var name=document.getElementById('newEmpName');
  var u=document.getElementById('newEmpU');
  var pw=document.getElementById('newEmpPw');
  var sal=document.getElementById('newEmpSal');
  var shift=document.getElementById('newEmpShift');
  if(!name || !u || !pw || !sal){
    showToast('املاء كل الحقول','w');
    return;
  }
  var emp={id:'emp_'+Date.now(),name:name.value,u:u.value,pw:pw.value,sal:parseInt(sal.value)||0,shift:shift?shift.value:''};
  saveEmp(emp);
  renderEmpTable();
  closeAddEmpModal();
  showToast('تم اضافة الموظف','s');
}

function delEmp(id){
  if(!confirm('حذف الموظف؟'))return;
  DB.del('emps');
  var emps=DB.get('emps')||[];
  for(var i=0;i<emps.length;i++){
    if(emps[i].id===id){emps.splice(i,1);break;}
  }
  DB.set('emps',emps);
  renderEmpTable();
  showToast('تم الحذف','s');
}

var startTimers=function(){
  renderAdmin();
};