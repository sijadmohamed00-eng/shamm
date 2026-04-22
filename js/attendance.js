// ═══ ATTENDANCE ═══
function doCI(){
  if(!gpsOk){alert('حدد الموقع اولاً');return;}
  var rec={eid:CU.id,t:'ci',dt:new Date().toISOString(),lat:uLat,lng:uLng};
  saveAtt(rec);
  document.getElementById('empTT1').textContent='🟢 حضرت';
  document.getElementById('empTSub1').textContent='وقت الحضور: '+new Date().toLocaleTimeString();
  showToast('تم تسجيل الحضور','s');
}

function doCO(){
  var rec={eid:CU.id,t:'co',dt:new Date().toISOString(),lat:uLat,lng:uLng};
  saveAtt(rec);
  showToast('تم تسجيل الانصراف','s');
}

function checkGPS(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      uLat=pos.coords.latitude;
      uLng=pos.coords.longitude;
      gpsOk=true;
      document.getElementById('gtxt').textContent='تم تحديد الموقع';
      document.getElementById('gdot').className='gdot ok';
      document.getElementById('btnCI').disabled=false;
      document.getElementById('btnCO').disabled=false;
    },function(){
      alert('تحقق من اعدادات الموقع');
    });
  }
}

function startGPS(){
  checkGPS();
}

var _gpsWatchId=null;
function toggleAutoCo(){
  if(_gpsWatchId){
    navigator.geolocation.clearWatch(_gpsWatchId);
    _gpsWatchId=null;
    showToast('الانصراف التلقائي ايقاف','i');
  } else {
    _gpsWatchId=navigator.geolocation.watchPosition(function(pos){
      uLat=pos.coords.latitude;
      uLng=pos.coords.longitude;
    });
    showToast('الانصراف التلقائي تشغيل','s');
  }
}