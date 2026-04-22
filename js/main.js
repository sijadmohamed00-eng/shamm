// ═══ INIT DATA ═══
function initData(){
  if(!DB.get('adminCreds')){
    DB.set('adminCreds',{u:'sajjad_admin',pw:'Admin@2025'});
  }
}

// ═══ INIT THEME ═══
function initTheme(){
  var dark=localStorage.getItem('ccs2_theme');
  if(dark==='dark'){document.body.classList.add('dark');}
}

function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('ccs2_theme',document.body.classList.contains('dark')?'dark':'light');
}

// ═══ CLOCK ═══
function startClock(){
  function tick(){
    var now=new Date();
    var h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
    var time=[h,m,s].map(function(x){return x<10?'0'+x:x;}).join(':');
    var el=document.getElementById('empClock');
    if(el){el.textContent=time;}
    var el2=document.getElementById('adminClock');
    if(el2){el2.textContent=time;}
  }
  tick();
  setInterval(tick,1000);
}

// ═══ STARTUP ═══
document.addEventListener('DOMContentLoaded',function(){
  initData();
  initTheme();
  startClock();
  tryAutoLogin();
});