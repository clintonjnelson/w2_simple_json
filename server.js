'use strict';

// Modules & Setup
var express = require('express');
var app = express();                // make app server
// var mongoose = require('mongoose'); // Don't need mongoose

// Setup Routes
var usersRoutes = express.Router(); // make router for users
require('./routes/users_routes.js')(usersRoutes);  // populate users routes

// Assign base route & put usersRoutes on top
app.use('/api', usersRoutes);

// NO database connection - JSON files instead
// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/user_development');

// Start server on env PORT or default 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on port: ', (process.env.PORT || 3000));
});
