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
    html+='<tr><td>'+(i+1)+'</td><td><strong>'+emps[i].name+'</strong></td><td>'+(emps[i].u||'')+'</td><td>'+(emps[i].shift||'')+'</td><td class="gnum">'+formatNum(emps[i].sal||0)+'</td><td>--</td><td><button class="btn btn-dn btn-sm" onclick="delEmp(\''+emps[i].id+'\')">🗑️</button></td></tr>';
  }
  document.getElementById('empListTable').innerHTML=html||'<tr><td colspan="7"><div class="empty"><div class="ei">👥</div><p>لا توجد موظفين</p></div></td></tr>';
  document.getElementById('empListCount').textContent=emps.length+' موظف';
}

function openAddEmp(){
  var html='<div class="modal" id="addEmpModal" style="display:flex"><div class="modal-content">';
  html+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--br)">';
  html+='<h3 style="margin:0;font-size:18px">➕ اضافة موظف جديد</h3>';
  html+='<button onclick="closeAddEmpModal()" style="background:none;border:none;color:var(--t2);font-size:24px;cursor:pointer">&times;</button></div>';
  html+='<div class="fg"><label>الاسم الكامل *</label><input type="text" id="newEmpName" class="fi" placeholder="مثال: احمد محمد"></div>';
  html+='<div class="fg"><label>اسم المستخدم *</label><input type="text" id="newEmpU" class="fi" placeholder="username" style="direction:ltr"></div>';
  html+='<div class="fg"><label>كلمة المرور *</label><input type="password" id="newEmpPw" class="fi" placeholder="******" style="direction:ltr"></div>';
  html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
  html+='<div class="fg"><label>الراتب الشهري</label><input type="number" id="newEmpSal" class="fi" placeholder="500000" value="500000"></div>';
  html+='<div class="fg"><label>الشفت</label><select id="newEmpShift" class="fi"><option value="14:00-02:00">6 م - 2 ل (12س)</option><option value="15:30-03:30">3:30 م - 3:30 ص (12س)</option><option value="18:00-02:00">6 م - 2 ل (8س)</option><option value="19:00-03:00">7 م - 3 ص (8س)</option><option value="19:30-03:30">7:30 م - 3:30 ص (8س)</option><option value="18:00-04:00">6 م - 4 ص (10س)</option></select></div>';
  html+='</div>';
  html+='<div style="display:flex;gap:10px;margin-top:20px">';
  html+='<button class="btn btn-sc" onclick="closeAddEmpModal()" style="flex:1">الغاء</button>';
  html+='<button class="btn btn-pr" onclick="addEmp()" style="flex:2">✨ اضافة الموظف</button>';
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
  if(!name.value || !u.value || !pw.value){
    showToast('املاء الحقول المطلوبة','w');
    return;
  }
  if(empExists(u.value)){
    showToast('اسم المستخدم مستخدم سابقاً','e');
    return;
  }
  var emp={id:'emp_'+Date.now(),name:name.value,u:u.value,pw:pw.value,sal:parseInt(sal.value)||0,shift:shift.value};
  saveEmp(emp);
  renderEmpTable();
  closeAddEmpModal();
  showToast('تم اضافة '+name.value+' بنجاح','s');
}

function delEmp(id){
  if(!confirm('هل تريد حذف هذا الموظف؟'))return;
  var emps=DB.get('emps')||[];
  for(var i=0;i<emps.length;i++){
    if(emps[i].id===id){
      var name=emps[i].name;
      emps.splice(i,1);
      DB.set('emps',emps);
      break;
    }
  }
  renderEmpTable();
  showToast('تم حذف '+name,'s');
}

var startTimers=function(){
  renderAdmin();
};
