const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Get a database reference to our database
var db = admin.database();

// "/test/sample/data" is just a example structure in DB, 
// you should create the most appropriate one for your data
var ref = db.ref("/test/sample/data");

// this "ref" points to the user list in our database
var usersRef = ref.child("users");


const app = require('express')();

app.get('/api/', (req, res) => {  
  res.send(`Root API page`);
});

app.get('/api/users', (req, res) => {  
  usersRef.once('value', function(data) {
    if (data.val()) {

      let result = [];

      data.forEach(function(item) {
        result.push(item.val());
      });

      res.status(200).send(result)
    } else {
      res.status(200).send([])
    }
  }, function(error) {
    console.log(error)
    res.status(500).send({ message: "Unknown Error" });

  });
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

  // this is how we read a single value once from realtime DB
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
