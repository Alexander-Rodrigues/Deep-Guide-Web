var firebaseConfig = {
	apiKey: "AIzaSyDNVUJX7pGPOUDQpS4Ryj6Jvof4XPcZXa8",
	authDomain: "deep-guide-web.firebaseapp.com",
	databaseURL: "https://deep-guide-web-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "deep-guide-web",
	storageBucket: "deep-guide-web.appspot.com",
	messagingSenderId: "125247287280",
	appId: "1:125247287280:web:916789f528a543de0d3735"
};

console.log(firebase);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//sorted 
/* firebase.database().ref('sorted/VOWKF/1/').set(record)
firebase.database().ref('sorted/VOWKF/2/').set(record)
firebase.database().ref('sorted/VOWKF/3/').set(record)
firebase.database().ref('sorted/VOWKF/4/').set(record) */

//unsorted
/* firebase.database().ref('unsorted').push(record)
firebase.database().ref('unsorted').push(record)
firebase.database().ref('unsorted').push(record)
firebase.database().ref('unsorted').push(record) */

function pushSortedRecord(name, num, obj){
	firebase.database().ref(`sorted/${name}/${num}/`).set(obj)
}

function pushUnsorted(obj){
	firebase.database().ref('unsorted').push(record)
}

function pushBoth(name, num, obj){
	firebase.database().ref(`sorted/${name}/${num}/`).set(obj);
	obj.name = name;
	obj.totalRounds = num;
	firebase.database().ref('unsorted/').push(obj);
}
