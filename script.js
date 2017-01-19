var config = {
    apiKey: "AIzaSyCNfAl-ENmtYFdizw5nIMGUN67SJhNysXw",
    authDomain: "ugly-clothing.firebaseapp.com",
    databaseURL: "https://ugly-clothing.firebaseio.com",
    storageBucket: "ugly-clothing.appspot.com",
    messagingSenderId: "912016071315"
  };
firebase.initializeApp(config);
var database = firebase.database();
var data = [];

function init() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("table-div").style.display = "block";
    document.getElementById("log-out").style.display = "block";
    document.getElementById("login-div").style.display = "none";
    return firebase.database().ref('/emails').orderByChild('date').once('value').then(function(snapshot) {
      snapshot.forEach(function(child) {
          data.push(child.val())
      });
      addToTable();
      console.log(data);
    });  
  } else {
      // No user is signed in.
    document.getElementById("login-div").style.display = "block";
    document.getElementById("table-div").style.display = "none";
    document.getElementById("log-out").style.display = "none";
    }
  });
}

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email + ", " + password);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  console.log(firebase.auth().user);
  init(); 
}

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    init();
  }, function(error) {
    // An error happened.
  });
}

function addToTable() {
  var table = document.getElementById('table');

  while (table.childElementCount > 1) {
      scoreTable.removeChild(scoreTable.lastChild);
  }

  for(var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');

    var c1 = document.createElement('td');
    c1.innerHTML = data[i].email;
    row.appendChild(c1);

    var c2 = document.createElement('td');
    c2.innerHTML = data[i].date;
    row.appendChild(c2);

    var c3 = document.createElement('td');
    c3.innerHTML = data[i].ip;
    row.appendChild(c3);

    table.appendChild(row);
  }
}