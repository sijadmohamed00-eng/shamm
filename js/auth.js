function doLogin(){
const u=document.getElementById('lUser').value.trim();
const p=document.getElementById('lPass').value.trim();
const rem=document.getElementById('rememberMe').checked;
const err=document.getElementById('lerr');

const creds=DB.get('adminCreds')||{u:'sajjad_admin',pw:'Admin@2025'};

if(u===creds.u&&p===creds.pw){
  CU={role:'admin'};
  err.classList.remove('show');
  if(rem)DB.set('remembered',{role:'admin'});
  showScreen('adminScreen');
  if(typeof renderAdmin==='function')renderAdmin();
  if(typeof startTimers==='function')startTimers();
  showToast('مرحباً يا سجاد 👑','s');
  return;
}

const emp=(DB.get('emps')||[]).find(e=>e.u===u&&e.pw===p);
if(emp){
  CU={role:'emp',id:emp.id};
  err.classList.remove('show');
  showScreen('empScreen');
  if(typeof loadEmpScreen==='function')loadEmpScreen(emp);
  showToast('مرحباً '+emp.name+' 😊','i');
  return;
}

const sa=(DB.get('subAdmins')||[]).find(a=>a.u===u&&a.pw===p);
if(sa){
  SA_MODE=true;
  CU={role:'admin',saId:sa.id,saName:sa.name};
  showScreen('adminScreen');
  showToast('مرحباً '+sa.name+' 👋','s');
  return;
}

err.classList.add('show');
}

function tryAutoLogin(){
const rem=DB.get('remembered');
if(!rem)return;
if(rem.role==='admin'){
  CU={role:'admin'};
  showScreen('adminScreen');
  if(typeof renderAdmin==='function')renderAdmin();
}else if(rem.role==='emp'&&rem.id){
  const emp=(DB.get('emps')||[]).find(e=>e.id===rem.id);
  if(emp){
    CU={role:'emp',id:emp.id};
    showScreen('empScreen');
    if(typeof loadEmpScreen==='function')loadEmpScreen(emp);
  }
}
}

function logout(){
CU=null; gpsOk=false; SA_MODE=false; CU_PERMS=null;
if(_gpsWatchId!==null&&navigator.geolocation){
  navigator.geolocation.clearWatch(_gpsWatchId);
  _gpsWatchId=null;
}
autoTimers.forEach(function(t){clearInterval(t);}); autoTimers=[];
showScreen('loginScreen');
document.getElementById('lUser').value='';
document.getElementById('lPass').value='';
}

function showScreen(id){
document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

document.getElementById('lPass').onkeydown=function(e){if(e.key==='Enter')doLogin()};
document.getElementById('lUser').onkeydown=function(e){if(e.key==='Enter')doLogin()};