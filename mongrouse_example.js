'use strict';

var mongrouse = require('./lib/mongrouse.js');

var schema = {
  username: String
};

// Instantiate new user class
var User = new mongrouse.Model('User', schema);

// Try to create a new user from the user class
var newUser1 = {'username': 'testname', 'deletesthis': 'junk'};


//// Create User
// User.create(newUser1, function(err, data) {
//   console.log('CREATE DATA: ', data);
// });

//// User.find({}, function(err, data) {
//   console.log("FIND DATA: ", data);
// });

//// PUT
// User.update(3, {username: 'test3'}, true, function(err, data) {
//   console.log("UPDATE USER DATA: ", data);
// });

//// PATCH
// User.update(2, {username: 'test2'}, false, function(err, data) {
//   console.log("UPDATE USER DATA: ", data);
// });

//// User.remove(1, function(err, data) {
//   console.log("DELETE RETURNS: ", data);
// });


