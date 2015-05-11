'use strict';

// Modules
var mongrouse = require('../lib/mongrouse');

// Define Schema
var userSchema = {
  username: String,
  email: String,
  passtoken: String,
  created_at: Date
};


// Exports the mongrouse model function with User & schema passed in
module.exports = new mongrouse.Model('User', userSchema);







// // Modules
// var mongoose = require('mongoose');

// // User Schema
// var userSchema = mongoose.Schema({
//   username: String,
//   email: String,
//   passtoken: String,
//   created_at: Date
// });

// // Validations
// userSchema.path('username').required(true);
// userSchema.path('username').index({unique: true});

// // Export the User & schems as a mongoose model
// module.exports = mongoose.model('User', userSchema);
