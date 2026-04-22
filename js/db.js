// ═══ DB HELPERS ═══
function saveEmp(emp){
  var emps=DB.get('emps')||[];
  var idx=-1;
  for(var i=0;i<emps.length;i++){
    if(emps[i].id===emp.id){idx=i;break;}
  }
  if(idx>=0){emps[idx]=emp;}
  else{emps.push(emp);}
  DB.set('emps',emps);
  syncToCloud('emps',emps);
}

function delEmp(id){
  var emps=DB.get('emps')||[];
  for(var i=0;i<emps.length;i++){
    if(emps[i].id===id){emps.splice(i,1);break;}
  }
  DB.set('emps',emps);
  syncToCloud('emps',emps);
}

function getEmpById(id){
  var emps=DB.get('emps')||[];
  for(var i=0;i<emps.length;i++){
    if(emps[i].id===id){return emps[i];}
  }
  return null;
}

function saveAtt(rec){
  var att=DB.get('att')||[];
  att.push(rec);
  DB.set('att',att);
  syncToCloud('att',att);
}

function getEmpAtt(empId){
  var att=DB.get('att')||[];
  return att.filter(function(a){return a.eid===empId;});
}