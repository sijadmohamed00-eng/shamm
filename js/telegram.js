// ═══ TELEGRAM ═══
function sendTg(msg){
  var url='https://api.telegram.org/bot'+TG_TOKEN+'/sendMessage?chat_id='+TG_CHAT_DEFAULT+'&text='+encodeURIComponent(msg);
  fetch(url).then(function(r){return r.json();}).then(function(d){console.log('TG sent',d);});
}

function sendTgReport(){
  var emps=getAllEmps();
  var att=DB.get('att')||[];
  var today=new Date().toISOString().split('T')[0];
  var pres=att.filter(function(a){return a.dt && a.dt.split('T')[0]===today && a.t==='ci';}).length;
  var msg='تقرير اليوم\nالحاضرون: '+pres+'/'+emps.length;
  sendTg(msg);
  showToast('تم ارسال التقرير','s');
}