// ═══ UI HELPERS ═══
function showToast(msg,type){
  type=type||'i';
  var colors={'s':'#4caf50','i':'#2196f3','w':'#ff9800','e':'#f44336'};
  var el=document.createElement('div');
  el.style.cssText='position:fixed;top:20px;right:20px;background:'+(colors[type]||'#333')+';color:white;padding:12px 20px;border-radius:8px;z-index:99999;font-size:14px;animation:fadeIn .3s';
  el.textContent=msg;
  document.body.appendChild(el);
  setTimeout(function(){el.style.animation='fadeOut .3s';setTimeout(function(){document.body.removeChild(el);},300);},3000);
}

function openModal(id){
  var el=document.getElementById(id);
  if(el){el.style.display='flex';}
}

function closeModal(id){
  var el=document.getElementById(id);
  if(el){el.style.display='none';}
}

function showATab(tab,el){
  document.querySelectorAll('#adminMainScroll .tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('#adminScreen .sitem').forEach(function(s){s.classList.remove('active');});
  document.getElementById('at-'+tab).classList.add('active');
  if(el){el.classList.add('active');}
}

function showETab(tab,el){
  document.querySelectorAll('#empMainScroll .tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('#empSidebar .sitem, #empMobileNav .mnav-item').forEach(function(s){s.classList.remove('active');});
  document.getElementById('et-'+tab).classList.add('active');
  if(el){el.classList.add('active');}
}

function formatNum(n){
  return (n||0).toLocaleString('en-US');
}

function formatDate(d){
  if(!d)return '--';
  var dt=new Date(d);
  return dt.getFullYear()+'/'+(dt.getMonth()+1)+'/'+dt.getDate();
}