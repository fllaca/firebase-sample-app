const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Get a database reference to our blog
var db = admin.database();

var ref = db.ref("/test/sample/data");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

  var message = "ERROR :(";

  if (request.method == "POST") {

    var usersRef = ref.child("users");

    var newItem = usersRef.push({foo: 'bar'});

    console.log("CREATED: " + newItem.key);

    message = "Writing: SUCCESS!!"
  }  else {
    message = "Reading: SUCCESS!!"
  }

  response.send(message);
});
