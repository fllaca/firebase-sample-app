const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Get a database reference to our blog
var db = admin.database();

var ref = db.ref("/test/sample/data");

// this "ref" points to the user list in our database
var usersRef = ref.child("users");


const app = require('express')();

app.get('/api/', (req, res) => {  
  res.send(`Root API page`);
});

app.post('/api/users', (req, res) => {  
  let newUserData = req.body;
  
  // create a new elemente in "users" collection in database  
  var newUserRef = usersRef.push();

  // add the generated key to the object as "id"
  newUserData.id = newUserRef.key;
  
  // store the json object in the ref created before
  newUserRef.set(newUserData);

  // send response back
  res.status(201).send(newUserData)
});

app.get('/api/users/:id', (req, res) => {  

  let userRef = usersRef.child(`${req.params.id}`);

  userRef.once('value', function(value){
    let result = value.val() 
    
    if (result) {
      res.status(200).send(result);
    } else {  
      res.status(404).send({ message: "Not Found" });
    }
    
  }, function(error) {
    console.log(error)
    res.status(500).send({ message: "Unknown Error" });

  })
});

// publish the function:
exports.api = functions.https.onRequest(app); 
