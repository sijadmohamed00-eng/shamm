// ═══ EMPLOYEE SCREEN ═══
function loadEmpScreen(emp){
  document.getElementById('empNameBar').textContent=emp.name;
  document.getElementById('empNameBig').textContent=emp.name;
  document.getElementById('empNameBadge').textContent=emp.name;
  document.getElementById('empShiftBar').textContent=emp.shift||'';
  document.getElementById('empWelcomeSub').textContent='يومك مبارك';
  startClock();
  renderEmpStats(emp.id);
}

function renderEmpStats(empId){
  var att=getEmpAtt(empId);
  var pres=att.filter(function(a){return a.t==='ci';}).length;
  document.getElementById('es-pres').textContent=pres;
  document.getElementById('es-abs').textContent=0;
  document.getElementById('es-bon').textContent=0;
  document.getElementById('es-net').textContent=pres;
}

function openPhotoUpload(){
  var input=document.createElement('input');
  input.type='file';
  input.accept='image/*';
  input.onchange=function(e){
    var file=e.target.files[0];
    var reader=new FileReader();
    reader.onload=function(ev){
      var photos=DB.get('empPhotos')||{};
      photos[CU.id]=ev.target.result;
      DB.set('empPhotos',photos);
      document.getElementById('empAvBig').style.backgroundImage='url('+ev.target.result+')';
    };
    reader.readAsDataURL(file);
  };
  input.click();
}