// ═══ attendance.js ═══
function checkGPS(){
  setGPSUI('checking','جاري تحديد الموقع...','يرجى السماح بالوصول');
  if(!navigator.geolocation){setGPSUI('fail','GPS غير مدعوم','');return}
  navigator.geolocation.getCurrentPosition(pos=>{
    uLat=pos.coords.latitude; uLng=pos.coords.longitude;
    const wl=getWorkLoc();
    const dist=calcDist(uLat,uLng,wl.lat,wl.lng);
    if(dist<=wl.rad){
      gpsOk=true;
      setGPSUI('ok',`✅ أنت داخل نطاق العمل`,`المسافة: ${Math.round(dist)} متر`);
      document.getElementById('ciSub').textContent='موقعك مؤكد';
    }else{
      gpsOk=false;
      setGPSUI('fail',`❌ خارج النطاق — ${Math.round(dist)} متر`,`الحد: ${wl.rad} متر`);
      document.getElementById('ciSub').textContent='يجب أن تكون في موقع العمل';
    }
    updAttBtns();
  },()=>{gpsOk=false;setGPSUI('fail','تعذّر تحديد الموقع','فعّل GPS وأعد المحاولة');updAttBtns()},
  {enableHighAccuracy:true,timeout:10000,maximumAge:0});
}
function setGPSUI(s,t,sb){
  const d=document.getElementById('gdot'),tx=document.getElementById('gtxt'),su=document.getElementById('gsub');
  if(d)d.className='gdot '+s; if(tx)tx.textContent=t; if(su)su.textContent=sb;
}

// ═══════════════════════════════════════════════════
//  EMPLOYEE SCREEN
// ═══════════════════════════════════════════════════
function getEmp(){return(DB.get('emps')||[]).find(e=>e.id===CU?.id)}

