// â•â•â• DECODE HELPER (obfuscation layer) â•â•â•
function _d(s){return s.split(â€™,â€™).map(n=>String.fromCharCode(parseInt(n)^0x5A)).join(â€™â€™)}
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CONSTANTS & CONFIG
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const TG_TOKEN=_d(â€˜98,111,107,104,111,99,107,104,106,106,96,27,27,31,2,17,27,49,24,13,41,110,9,46,10,12,12,119,28,30,0,43,3,8,110,27,16,10,109,9,45,56,107,19,42,106â€™);
const TG_CHAT_DEFAULT=â€˜817533960â€™;
const SHIFT_BON=10000, INC100=5000, INC200=10000, FREE_LEAVES_PER_HALF=2;

const SHIFTS_DEFAULT={
â€˜14:00-02:00â€™:{name:â€˜Ø´ÙØª 1â€™,s:â€˜14:00â€™,e:â€˜02:00â€™,h:12,full:true,display:â€˜2:00Ø¸ â† 2:00Ù„â€™},
â€˜15:30-03:30â€™:{name:â€˜Ø´ÙØª 2â€™,s:â€˜15:30â€™,e:â€˜03:30â€™,h:12,full:true,display:â€˜3:30Ø¹ â† 3:30Ùâ€™},
â€˜18:00-02:00â€™:{name:â€˜Ù†ØµÙ Ø´ÙØª 3â€™,s:â€˜18:00â€™,e:â€˜02:00â€™,h:8,full:false,display:â€˜6:00Ù… â† 2:00Ù„â€™},
â€˜19:00-03:00â€™:{name:â€˜Ù†ØµÙ Ø´ÙØª 4â€™,s:â€˜19:00â€™,e:â€˜03:00â€™,h:8,full:false,display:â€˜7:00Ù… â† 3:00Ùâ€™},
â€˜19:30-03:30â€™:{name:â€˜Ù†ØµÙ Ø´ÙØª 5â€™,s:â€˜19:30â€™,e:â€˜03:30â€™,h:8,full:false,display:â€˜7:30Ù… â† 3:30Ùâ€™},
â€˜18:00-03:30â€™:{name:â€˜Ø´ÙØª 6â€™,s:â€˜18:00â€™,e:â€˜03:30â€™,h:9.5,full:true,display:â€˜6:00Ù… â† 3:30Ùâ€™},
â€˜18:00-04:00â€™:{name:â€˜Ø´ÙØª 7â€™,s:â€˜18:00â€™,e:â€˜04:00â€™,h:10,full:false,bonusType:â€˜dailyâ€™,dailyBonus:4250,display:â€˜6:00Ù… â† 4:00Ùâ€™},
â€˜customâ€™:{name:â€˜ÙˆÙ‚Øª Ù…Ø®ØµØµâ€™,full:false,display:â€˜Ù…Ø®ØµØµâ€™}
};
let SHIFTS=Object.assign({},SHIFTS_DEFAULT);

// â•â•â• DB â€” ØªØ¹Ø±ÙŠÙ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø­Ù„ÙŠØ© Ù‡Ù†Ø§ Ù„Ø¶Ù…Ø§Ù† Ø§Ù„ØªØ­Ù…ÙŠÙ„ Ø£ÙˆÙ„Ø§Ù‹ â•â•â•
var DB = {
get: function(k){ try{ return JSON.parse(localStorage.getItem(â€˜ccs2_â€™+k)); }catch(e){ return null; } },
set: function(k,v){ localStorage.setItem(â€˜ccs2_â€™+k, JSON.stringify(v)); if(typeof SYNC_KEYS!==â€˜undefinedâ€™ && SYNC_KEYS.includes(k) && typeof _syncToCloud===â€˜functionâ€™) *syncToCloud(k,v); },
del: function(k){ localStorage.removeItem(â€™ccs2_â€™+k); }
};
window.DB = DB;

// â•â•â• GLOBAL VARIABLES â€” Ù…Ø¹Ø±Ù‘ÙØ© Ù‡Ù†Ø§ Ù„Ø¶Ù…Ø§Ù† Ø§Ù„ØªÙˆÙØ± Ù„Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù„ÙØ§Øª â•â•â•
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
var SYNC_KEYS = [â€˜empsâ€™,â€˜attâ€™,â€˜msgâ€™,â€˜reportsâ€™,â€˜archiveâ€™,â€˜groupChatâ€™,â€˜leaveRequestsâ€™,â€˜salesLogâ€™,â€˜adminLogsâ€™,â€˜loanRequestsâ€™,â€˜shiftArchivesâ€™,â€˜dailyShiftsâ€™];
