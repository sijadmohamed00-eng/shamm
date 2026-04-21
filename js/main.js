// ═══════════════════════════════════════════════════════════════════
//  BOOT — تهيئة النظام
// ═══════════════════════════════════════════════════════════════════

// Export ALL utility functions to window for HTML onclick handlers
window.debugClear = function(){
  console.log('=== DEBUG CLEAR ===');
  console.log('localStorage keys:', Object.keys(localStorage).filter(k=>k.startsWith('ccs2_')));
  ['leaveRequests','loanRequests','adminLogs','groupChat'].forEach(k=>{
    console.log(k+':', DB.get(k));
  });
};

// Master clear functions
window.clearLeaveRequests = function(){
  if(!confirm('مسح طلبات الإجازة السابقة؟'))return;
  console.log('Clearing leave requests...');
  localStorage.setItem('ccs2_leaveRequests',JSON.stringify([]));
  document.getElementById('leaveArchivedList').innerHTML='<div class="empty"><div class="ei">🌴</div><p>تم المسح</p></div>';
  alert('تم مسح طلبات الإجازة!');
};

window.clearLoanRequests = function(){
  if(!confirm('مسح طلبات السلف السابقة؟'))return;
  console.log('Clearing loan requests...');
  localStorage.setItem('ccs2_loanRequests',JSON.stringify([]));
  document.getElementById('loanArchivedList').innerHTML='<div class="empty"><div class="ei">💳</div><p>تم المسح</p></div>';
  alert('تم مسح طلبات السلف!');
};

window.clearAllAdminLogs = function(){
  if(!confirm('مسح سجل العمليات؟'))return;
  console.log('Clearing admin logs...');
  localStorage.setItem('ccs2_adminLogs',JSON.stringify([]));
  document.getElementById('adminLogsList').innerHTML='<div class="empty"><div class="ei">📝</div><p>لا توجد عمليات</p></div>';
  alert('تم مسح سجل العمليات!');
};

window.clearAllData = function(){
  if(!confirm('⚠️ مسح كل البيانات نهائياً؟'))return;
  console.log('Clearing ALL data...');
  const keys = ['emps','att','msg','reports','archive','lastReset','remembered','leaveRequests','loanRequests','adminLogs','groupChat','dailyShifts','shifts','subAdmins','empToAdminMsg','empPhotos','sales'];
  keys.forEach(k=>{localStorage.removeItem('ccs2_'+k));});
  alert('تم مسح كل البيانات!');
  location.reload();
};

window.factoryReset = function(){
  if(!confirm('⚠️⚠️⚠️ إعادة ضبط المصنع الكامل؟\nسيتم مسح كل البيانات نهائياً!\nهل أنت متأكد؟'))return;
  console.log('Factory reset...');
  Object.keys(localStorage).forEach(k=>{if(k.startsWith('ccs2_'))localStorage.removeItem(k);});
  location.reload();
};

// Load
initData();
initTheme();
startClock();