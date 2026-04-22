// ═══ LOANS ═══
function submitLoanRequest(){
  var amt=document.getElementById('loanAmt').value;
  var reason=document.getElementById('loanReason').value;
  if(!amt||!reason){alert('املاء الحقول');return;}
  var loans=DB.get('loanRequests')||[];
  loans.push({empId:CU.id,amt:amt,reason:reason,dt:new Date().toISOString(),status:'pending'});
  DB.set('loanRequests',loans);
  showToast('تم ارسال الطلب','s');
}

function selectLoan(el,amt){
  document.querySelectorAll('.loan-opt').forEach(function(x){x.style.background='';});
  el.style.background='var(--gold)';
  document.getElementById('loanAmt').value=amt;
  document.getElementById('loanSelectedLabel').textContent=formatNum(amt)+' د.ع';
}

function selectLoanCustom(amt){
  document.getElementById('loanAmt').value=amt;
  document.getElementById('loanSelectedLabel').textContent=formatNum(amt)+' د.ع';
}

function renderLoanHistory(){}