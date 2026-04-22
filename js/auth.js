function doLogin(){
  var u=document.getElementById('lUser').value.trim();
  var p=document.getElementById('lPass').value.trim();
  var rem=document.getElementById('rememberMe').checked;
  var err=document.getElementById('lerr');

  var creds={u:'sajjad_admin',pw:'Admin@2025'};

  if(u===creds.u && p===creds.pw){
    CU={role:'admin'};
    err.classList.remove('show');
    if(rem){DB.set('remembered',{role:'admin'});}
    showScreen('adminScreen');
    if(typeof renderAdmin==='function'){renderAdmin();}
    if(typeof startTimers==='function'){startTimers();}
    if(typeof showToast==='function'){showToast('مرحباً يا سجاد 👑','s');} else {alert('مرحباً يا سجاد');}
    return;
  }

  var emps=DB.get('emps') || [];
  for(var i=0;i<emps.length;i++){
    if(emps[i].u===u && emps[i].pw===p){
      CU={role:'emp',id:emps[i].id};
      err.classList.remove('show');
      showScreen('empScreen');
      if(typeof loadEmpScreen==='function'){loadEmpScreen(emps[i]);}
      if(typeof showToast==='function'){showToast('مرحباً '+emps[i].name,'i');}
      return;
    }
  }

  err.classList.add('show');
}

function tryAutoLogin(){
  var rem=DB.get('remembered');
  if(!rem){return;}
  if(rem.role==='admin'){
    CU={role:'admin'};
    showScreen('adminScreen');
    if(typeof renderAdmin==='function'){renderAdmin();}
  } else if(rem.role==='emp' && rem.id){
    var emps=DB.get('emps') || [];
    for(var i=0;i<emps.length;i++){
      if(emps[i].id===rem.id){
        CU={role:'emp',id:emps[i].id};
        showScreen('empScreen');
        if(typeof loadEmpScreen==='function'){loadEmpScreen(emps[i]);}
        break;
      }
    }
  }
}

function logout(){
  CU=null;
  SA_MODE=false;
  gpsOk=false;
  autoTimers.forEach(function(t){clearInterval(t);});
  autoTimers=[];
  showScreen('loginScreen');
  document.getElementById('lUser').value='';
  document.getElementById('lPass').value='';
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
  document.getElementById(id).classList.add('active');
}