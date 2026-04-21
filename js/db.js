function initData(){
  // Admin credentials - DO NOT CHANGE unless you want to reset admin
  if(!DB.get('adminCreds'))DB.set('adminCreds',{u:_d('41,59,48,48,59,62,5,59,62,55,51,52'),pw:_d('27,62,55,51,52,26,104,106,104,111')});
  
  // Telegram settings - only set default if not already saved
  if(!DB.get('tgId'))DB.set('tgId',TG_CHAT_DEFAULT);
  
  // Only initialize empty arrays if they don't exist
  if(!DB.get('emps'))DB.set('emps',[]);
  if(!DB.get('att'))DB.set('att',[]);
  if(!DB.get('msg'))DB.set('msg',[]);
  if(!DB.get('reports'))DB.set('reports',[]);
  if(!DB.get('archive'))DB.set('archive',{periods:[],snapshots:{}});
  if(!DB.get('groupChat'))DB.set('groupChat',[]);
  if(!DB.get('leaveRequests'))DB.set('leaveRequests',[]);
  if(!DB.get('salesLog'))DB.set('salesLog',[]);
  if(!DB.get('adminLogs'))DB.set('adminLogs',[]);
  if(!DB.get('loanRequests'))DB.set('loanRequests',[]);
  
  console.log('Data initialized. Saved keys:', Object.keys(localStorage).filter(k=>k.startsWith('ccs2_')));
}

// ═══════════════════════════════════════════════════
//  PERIOD & SALARY
// ═══════════════════════════════════════════════════
