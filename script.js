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
    data = [];
    firebase.database().ref('/emails').orderByChild('date').once('value').then(function(snapshot) {
      snapshot.forEach(function(child) {
          if(child.val().hidden != "true") {
            var temp = child.val();
            temp.key = child.key;
            data.push(temp);
          }
      });
      addToTable();
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
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    data = [];
    location.reload();
    init(); 
  });
}

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    data = [];
    location.reload();
    init();
  }, function(error) {
    // An error happened.
  });
}

function addToTable() {
  var table = document.getElementById('table');

  while (table.childElementCount > 1) {
      table.removeChild(table.lastChild);
  }

  for(var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');

    var c1 = document.createElement('td');
    c1.innerHTML = data[i].email;
    row.appendChild(c1);

    var c2 = document.createElement('td');
    var time = new Date(data[i].date);
    time = time.toString();
    time = time.substring(0, time.length-15);
    c2.innerHTML = time;
    row.appendChild(c2);

    var c3 = document.createElement('td');
    c3.innerHTML = data[i].ip;
    row.appendChild(c3);

    var c4 = document.createElement('td');
    var button = document.createElement('button');
    button.innerHTML = "Remove";
    button.setAttribute("class", "mdl-button mdl-js-button mdl-button--accent");
    button.setAttribute("onclick", "remove(" + i + ")");
    c4.appendChild(button);
    row.appendChild(c4);

    table.appendChild(row);
  }
}

function remove(index) {
  if(confirm("Are you sure you want to remove " + data[index].email + "?")) {
    var temp = data[index];
    var key = data[index].key;
    temp.hidden = "true";
    delete temp.key;
    firebase.database().ref('emails/' + key).set(temp);
    var table = document.getElementById("table");
    table.removeChild(table.childNodes[table.childNodes.length - data.length + index]);
    //location.reload();
  }
}

function csv() {
  var csvContent = "data:text/csv;charset=utf-8,";
  var array = [];
  for(var i = 0; i < data.length; i++) {
    array.push([data[i].email, data[i].date, data[i].ip]);
  }
  array.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < array.length ? dataString+ "\n" : dataString;
  });
  var encodedUri = encodeURI(csvContent);
  window.location = encodedUri;
}