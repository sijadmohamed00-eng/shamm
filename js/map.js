// ═══ MAP ═══
function renderMap(){
  var locs=DB.get('empLocations')||{};
  var html='';
  var emps=getAllEmps();
  for(var i=0;i<emps.length;i++){
    var loc=locs[emps[i].id];
    html+='<div>'+emps[i].name+' - '+(loc?loc.lat+','+loc.lng:'غير محدد')+'</div>';
  }
  document.getElementById('empLocationList').innerHTML=html;
}

function refreshMapData(){
  renderMap();
  showToast('تم التحديث','s');
}