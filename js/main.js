// Clear old localStorage keys (run once on update)
(function(){
  const oldKeys = [
    'groupchatLastSeen', 'ccs2_groupchatLastSeen',
    'emp', 'att', 'emps', 'leaveRequests', 'loanRequests',
    'adminLogs', 'msg', 'groupchat', 'dailyShifts', 'shifts',
    'subAdmins', 'tgId', 'tgToken', 'fbcfg', 'theme'
  ];
  // Migrate old keys to ccs2_ prefix if not already migrated
  oldKeys.forEach(k => {
    try {
      const oldVal = localStorage.getItem(k);
      if(oldVal && !k.startsWith('ccs2_')){
        localStorage.setItem('ccs2_' + k, oldVal);
        localStorage.removeItem(k);
        console.log('Migrated:', k);
      }
    } catch(e){}
  });
  // Also check for any non-ccs2 keys and offer to clean
  const keysToRemove = [];
  for(let i=0; i<localStorage.length; i++){
    const k = localStorage.key(i);
    if(k && !k.startsWith('ccs2_') && !k.startsWith('firebase:') && !k.startsWith('gauth_')){
      keysToRemove.push(k);
    }
  }
  // Remove completely unrelated old keys (optional - comment out to disable)
  // keysToRemove.forEach(k => localStorage.removeItem(k));
})();

initData();
initTheme();
startClock();