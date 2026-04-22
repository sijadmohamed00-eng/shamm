// ═══ SALES ═══
function saveSale(empId,data){
  var sales=DB.get('salesLog')||[];
  sales.push({empId:empId,data:data,dt:new Date().toISOString()});
  DB.set('salesLog',sales);
}

function renderSalesLog(){}

function openAddSaleNew(){
  alert('اضافة طلب جديد');
}