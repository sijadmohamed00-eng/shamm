// ═══ FIREBASE INIT ═══
// Firebase config - add your own config
var firebaseConfig = {
  apiKey: "AIzaSyDemo",
  authDomain: "abn-alsham.firebaseapp.com",
  databaseURL: "https://abn-alsham-default-rtdb.firebaseio.com",
  projectId: "abn-alsham",
  storageBucket: "abn-alsham.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
try {
  if(typeof firebase !== 'undefined'){
    firebase.initializeApp(firebaseConfig);
    fbDB = firebase.database();
    fbSyncEnabled = true;
  }
} catch(e) {
  console.log('Firebase not available');
}

// ═══ SYNC ═══
function syncToCloud(key,val){
  if(fbDB && fbSyncEnabled){
    fbDB.ref('ccs/'+key).set(val);
  }
}