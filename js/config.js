// ═══ DB ═══
var DB = {
  get: function(k){ try{ return JSON.parse(localStorage.getItem('ccs2_'+k)); }catch(e){ return null; } },
  set: function(k,v){ localStorage.setItem('ccs2_'+k, JSON.stringify(v)); },
  del: function(k){ localStorage.removeItem('ccs2_'+k); }
};
window.DB = DB;

// ═══ CONSTANTS ═══
const TG_TOKEN='123456789:ABCdefGHIjklMNOpqrsTUVwxyz';
const TG_CHAT_DEFAULT='817533960';
const SHIFT_BON=10000, INC100=5000, INC200=10000, FREE_LEAVES_PER_HALF=2;

// ═══ SHIFTS ═══
const SHIFTS_DEFAULT={
  '14:00-02:00':{name:'شفت 1',s:'14:00',e:'02:00',h:12,full:true,display:'2:00م ← 2:00ل'},
  '15:30-03:30':{name:'شفت 2',s:'15:30',e:'03:30',h:12,full:true,display:'3:30ع ← 3:30م'},
  '18:00-02:00':{name:'نصف شفت 3',s:'18:00',e:'02:00',h:8,full:false,display:'6:00م ← 2:00ل'},
  '19:00-03:00':{name:'نصف شفت 4',s:'19:00',e:'03:00',h:8,full:false,display:'7:00م ← 3:00ص'},
  '19:30-03:30':{name:'نصف شفت 5',s:'19:30',e:'03:30',h:8,full:false,display:'7:30م ← 3:30ص'},
  '18:00-03:30':{name:'شفت 6',s:'18:00',e:'03:30',h:9.5,full:true,display:'6:00م ← 3:30ص'},
  '18:00-04:00':{name:'شفت 7',s:'18:00',e:'04:00',h:10,full:false,bonusType:'daily',dailyBonus:4250,display:'6:00م ← 4:00ص'},
  'custom':{name:'وقت مخصص',full:false,display:'مخصص'}
};
let SHIFTS=Object.assign({},SHIFTS_DEFAULT);

// ═══ GLOBALS ═══
var CU = null;
var SA_MODE = false;
var CU_PERMS = null;
var DID = null;
var QSID = null;
var gpsOk = false;
var uLat = null;
var uLng = null;
var fbDB = null;
var fbSyncEnabled = false;
var salChartI = null;
var attChartI = null;
var autoTimers = [];
var viewingReportId = null;
var SYNC_KEYS = ['emps','att','msg','reports','archive','groupChat','leaveRequests','salesLog','adminLogs','loanRequests','shiftArchives','dailyShifts'];