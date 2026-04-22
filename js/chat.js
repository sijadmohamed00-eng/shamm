// ═══ CHAT ═══
function sendChatMsg(){
  var input=document.getElementById('empChatInput');
  var msg=input.value.trim();
  if(!msg)return;
  var chat=DB.get('groupChat')||[];
  chat.push({u:CU.id,name:document.getElementById('empNameBig').textContent,msg:msg,dt:new Date().toISOString()});
  DB.set('groupChat',chat);
  input.value='';
  renderChat();
}

function renderChat(){
  var chat=DB.get('groupChat')||[];
  var html='';
  for(var i=0;i<chat.length;i++){
    html+='<div><strong>'+chat[i].name+':</strong> '+chat[i].msg+'</div>';
  }
  document.getElementById('empChatMessages').innerHTML=html;
  document.getElementById('adminChatMessages').innerHTML=html;
}

function sendAdminChatMsg(){
  var input=document.getElementById('adminChatInput');
  var msg=input.value.trim();
  if(!msg)return;
  var chat=DB.get('groupChat')||[];
  chat.push({u:'admin',name:'المدير',msg:msg,dt:new Date().toISOString()});
  DB.set('groupChat',chat);
  input.value='';
  renderChat();
}