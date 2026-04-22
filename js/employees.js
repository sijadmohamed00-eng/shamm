// ═══ EMPLOYEES LIST ═══
function getAllEmps(){
  return DB.get('emps')||[];
}

function empExists(u){
  var emps=getAllEmps();
  for(var i=0;i<emps.length;i++){
    if(emps[i].u===u){return true;}
  }
  return false;
}