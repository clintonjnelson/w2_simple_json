'use strict';

var User = require('../models/User.js');
var bodyparser = require('body-parser');

// Function to make routes with passed express router
module.exports = function(router) {
  router.use(bodyparser.json());  // api will receive json

  // R: get single user
  // router.get('/users/:username', function(req, res) {
  //   var username = req.params.username;
  //   User.find({'username': username}, function(err, data) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json( {msg: 'internal server error'} );
  //     }

  //     res.json(data);
  //   });
  // });

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

  // C: create user
  router.post('/users', function(req, res) {
    // var newUser = new User(req.body);   // Create a new User instance
    User.create(req.body, function(err, data) {  // try to save created instance
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: 'success' });
      // res.json({msg: (data.success === true ? 'success' : 'user could not be saved') });
    });
  });

  // U: update ALL user values
  router.put('/users/:id', function(req, res) {
    var userUpdates = req.body;
    User.update(req.params.id, userUpdates, true, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: 'user updated'});
    });
  });

  // U: update PASSED user values
  router.patch('/users/:id', function(req, res) {
    var userUpdates = req.body;

    User.update(req.params.id, userUpdates, false, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json({msg: 'success'});
    });
  });

  // D: remove user
  router.delete('/users/:id', function(req, res) {
    User.remove(req.params.id, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json( {msg: (data === true ? 'user removed' : 'user could not be removed') } );
    });
  });

};
