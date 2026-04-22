// DEBUG: Login Fix - Added console.log for debugging

function doLogin(){
console.log('🔵 doLogin function CALLED');
console.log('DB exists:', typeof DB !== 'undefined');
console.log('showScreen exists:', typeof showScreen !== 'undefined');

try {
const u=document.getElementById('lUser').value.trim();
const p=document.getElementById('lPass').value.trim();
const rem=document.getElementById('rememberMe').checked;
const err=document.getElementById('lerr');

// Debug: check elements
console.log('lUser element:', !!document.getElementById('lUser'));
console.log('lPass element:', !!document.getElementById('lPass'));
console.log('Username input:', u);
console.log('Password input:', p);

// Get credentials - try default if DB not available
let creds;
try {
  creds = DB.get('adminCreds');
} catch(e) {
  console.log('DB.get error:', e);
}
if(!creds) {
  creds = {u: 'sajjad_admin', pw: 'Admin@2025'};
}
console.log('Credentials:', creds);

// Check login
console.log('Checking credentials... u===creds.u:', u === creds.u, 'p===creds.pw:', p === creds.pw);

if(u === creds.u && p === creds.pw){
console.log('✅ Admin login success!');
CU = {role: 'admin'};
err.classList.remove('show');
if(rem) DB.set('remembered', {role: 'admin'});

// Show admin screen
showScreen('adminScreen');
if(typeof renderAdmin === 'function') renderAdmin();
if(typeof startTimers === 'function') startTimers();
if(typeof showToast === 'function') {
  showToast('مرحباً يا سجاد 👑', 's');
} else {
  alert('مرحباً يا سجاد 👑');
}
return;
}

// Check employee login
const emps = DB.get('emps') || [];
const emp = emps.find(e => e.u === u && e.p === p);
if(emp){
console.log('✅ Employee login success!');
CU = {role: 'emp', id: emp.id};
err.classList.remove('show');
showScreen('empScreen');
if(typeof loadEmpScreen === 'function') loadEmpScreen(emp);
if(typeof showToast === 'function') showToast('مرحباً ' + emp.name + ' 😊', 'i');
return;
}

// Check sub-admin
const subAdmins = DB.get('subAdmins') || [];
const sa = subAdmins.find(a => a.u === u && a.p === p);
if(sa){
console.log('✅ Sub-admin login success!');
SA_MODE = true;
CU = {role: 'admin', saId: sa.id, saName: sa.name};
showScreen('adminScreen');
if(typeof showToast === 'function') showToast('مرحباً ' + sa.name + ' 👋', 's');
return;
}

// No match - show error
console.log('❌ Login failed - invalid credentials');
err.classList.add('show');
} catch(e) {
console.error('doLogin error:', e);
alert('Error: ' + e.message);
}
}

function tryAutoLogin(){
const rem = DB.get('remembered');
if(!rem) return;
console.log('🔄 Auto-login attempt, role:', rem.role);

if(rem.role === 'admin'){
CU = {role: 'admin'};
showScreen('adminScreen');
if(typeof renderAdmin === 'function') renderAdmin();
} else if(rem.role === 'emp' && rem.id){
const emps = DB.get('emps') || [];
const emp = emps.find(e => e.id === rem.id);
if(emp){
CU = {role: 'emp', id: emp.id};
showScreen('empScreen');
if(typeof loadEmpScreen === 'function') loadEmpScreen(emp);
}
}
}

function logout(clearData){
if(typeof clearData === 'undefined') clearData = false;
CU = null;
SA_MODE = false;
autoTimers.forEach(function(t){clearInterval(t);});
autoTimers = [];
if(clearData){
try { DB.del('remembered'); } catch(e) {}
}
showScreen('loginScreen');
document.getElementById('lUser').value = '';
document.getElementById('lPass').value = '';
}

function showScreen(id){
console.log('📺 showScreen:', id);
document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

// Export to window
window.doLogin = doLogin;
window.tryAutoLogin = tryAutoLogin;
window.logout = logout;
window.showScreen = showScreen;