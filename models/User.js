'use strict';

// Modules
var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: String,
  email: String,
  passtoken: String,
  created_at: Date
});

// Validations
userSchema.path('username').required(true);
userSchema.path('username').index({unique: true});

// Export the User & schems as a mongoose model
module.exports = mongoose.model('User', userSchema);
