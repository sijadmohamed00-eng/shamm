// ═══════════════════════════════════════════════════════════════════
//  BOOT — تهيئة النظام
// ═══════════════════════════════════════════════════════════════════

// Global error handler
window.onerror = function(msg, url, line, col, error) {
console.error(‘Global Error:’, msg, ‘at line’, line);
return false;
};

// Make sure we run after DOM is ready
document.addEventListener(‘DOMContentLoaded’, function(){

console.log(‘Main.js loaded - setting up clear functions’);

// Master clear functions
window.clearLeaveRequests = function(){
if(!confirm(‘مسح طلبات الإجازة السابقة؟’))return;
console.log(‘Clearing leave requests…’);
try {
localStorage.setItem(‘ccs2_leaveRequests’,JSON.stringify([]));
var el = document.getElementById(‘leaveArchivedList’);
if(el) el.innerHTML = ‘<div class="empty"><div class="ei">🌴</div><p>تم المسح</p></div>’;
alert(‘تم مسح طلبات الإجازة!’);
} catch(e) { console.error(e); alert(’Error: ’ + e.message); }
};

window.clearLoanRequests = function(){
if(!confirm(‘مسح طلبات السلف السابقة؟’))return;
console.log(‘Clearing loan requests…’);
try {
localStorage.setItem(‘ccs2_loanRequests’,JSON.stringify([]));
var el = document.getElementById(‘loanArchivedList’);
if(el) el.innerHTML = ‘<div class="empty"><div class="ei">💳</div><p>تم المسح</p></div>’;
alert(‘تم مسح طلبات السلف!’);
} catch(e) { console.error(e); alert(’Error: ’ + e.message); }
};

window.clearAllAdminLogs = function(){
if(!confirm(‘مسح سجل العمليات؟’))return;
console.log(‘Clearing admin logs…’);
try {
localStorage.setItem(‘ccs2_adminLogs’,JSON.stringify([]));
var el = document.getElementById(‘adminLogsList’);
if(el) el.innerHTML = ‘<div class="empty"><div class="ei">📝</div><p>لا توجد عمليات</p></div>’;
alert(‘تم مسح سجل العمليات!’);
} catch(e) { console.error(e); alert(’Error: ’ + e.message); }
};

window.clearAllData = function(){
if(!confirm(‘⚠️ مسح كل البيانات نهائياً؟’))return;
console.log(‘Clearing ALL data…’);
try {
var keys = [‘emps’,‘att’,‘msg’,‘reports’,‘archive’,‘lastReset’,‘remembered’,‘leaveRequests’,‘loanRequests’,‘adminLogs’,‘groupChat’,‘dailyShifts’,‘shifts’,‘subAdmins’,‘empToAdminMsg’,‘empPhotos’,‘sales’];
keys.forEach(function(k){
try { localStorage.removeItem(‘ccs2_’+k); } catch(e){}
});
alert(‘تم مسح كل البيانات!’);
location.reload();
} catch(e) { console.error(e); alert(’Error: ’ + e.message); }
};

window.factoryReset = function(){
if(!confirm(‘⚠️⚠️⚠️ إعادة ضبط المصنع الكامل؟\nسيتم مسح كل البيانات نهائياً!\nهل أنت متأكد؟’))return;
console.log(‘Factory reset…’);
try {
Object.keys(localStorage).forEach(function(k){
if(k.startsWith(‘ccs2_’)) localStorage.removeItem(k);
});
location.reload();
} catch(e) { console.error(e); alert(’Error: ’ + e.message); }
};

console.log(‘Clear functions registered’);

// Initialize other stuff
initData();
initTheme();
startClock();
});