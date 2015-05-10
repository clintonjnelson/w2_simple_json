'use strict';

var User = require('../models/User.js');
var bodyparser = require('body-parser');

// Function to make routes with passed express router
module.exports = function(router) {
  router.use(bodyparser.json());  // api will receive json

  // R: get single user
  router.get('/users/:username', function(req, res) {
    var username = req.params.username;
    User.find({'username': username}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json( {msg: 'internal server error'} );
      }

      res.json(data);
    });
  });

  // R: get ALL users
  router.get('/users', function(req, res) {
    User.find({}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });


  // D: remove user
  router.delete('/users/:id', function(req, res) {
    User.remove({'_id': req.params.id}, function(err, data) {
      console.log("GETTING HERE");
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      }

      res.json( {msg: (data.result.n ? 'user removed' : 'user could not be removed')} );
    });
  });

};
