// ═══ SUBADMIN ═══
function addSubAdmin(data){
  var subs=DB.get('subAdmins')||[];
  data.id='sa_'+Date.now();
  subs.push(data);
  DB.set('subAdmins',subs);
  showToast('تم اضافة المدير الفرعي','s');
}

function renderSubAdminList(){}

function applySubAdminPermissions(){}