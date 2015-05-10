'use strict';

// Models & Setup
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var mongoose = require('mongoose');
var User = require('../models/User.js');

// Point mongoose to the db
process.env.MONGOLAB_URI = 'mongodb://localhost/user_development';

// Start Server
require('../server.js');

describe('Users', function() {
  describe('with existing users', function() {
    // Populate database
    var newUsers;
    before(function(done) {
      newUsers = User.create({username: 'joe', email: 'joe@joe.com', passtoken: '1234'},
                             {username: 'jen', email: 'jen@jen.com', passtoken: '5678'}, function(err, newUser) {
        done();
      });
    });
    // Clean database
    after(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
    });


    describe('GET for a specific user', function() {
      var joe;
      before(function(done) {
        chai.request('localhost:3000')
          .get('/api/users/joe')
          .end(function(err, res) {
            joe = res.body;
            done();
          });
      });
      it('returns the user', function() {
        expect(Object.prototype.toString.call(joe)).to.eq('[object Array]');
        expect(joe.length).to.eq(1);
      });
      it('returns the user\'s username', function(){
        expect(joe[0].username).to.eql('joe');
      });
      it('returns the user\'s  email', function() {
        expect(joe[0].email).to.eql('joe@joe.com');
      });
      it('returns the user\'s  passtoken', function() {
        expect(joe[0].passtoken).to.eql('1234');
      });
    });
    describe('GET for no specific user', function() {
      var users;
      before(function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            users = res.body;
            done();
          });
      });

      it('returns multiple user\'s info', function() {
        expect(Object.prototype.toString.call(users)).to.eq('[object Array]');
        expect(users.length).to.eq(2);
      });
      it('returns multiple users\' usernames', function(){
        expect(users[0].username).to.eql('joe');
        expect(users[1].username).to.eql('jen');
      });
      it('returns the users\'  emails', function() {
        expect(users[0].email).to.eql('joe@joe.com');
        expect(users[1].email).to.eql('jen@jen.com');
      });
      it('returns the users\'  passtokens', function() {
        expect(users[0].passtoken).to.eql('1234');
        expect(users[1].passtoken).to.eql('5678');
      });
    });
    describe('POST', function() {
      // it('does not duplicate users', function() {

      // });
    });
    // describe('PUT', function() {
    //   it('updates ALL fields of a user', function() {

    //   });
    // });
    // describe('PATCH', function() {
    //   it('updates only the specified fields of a user', function() {

    //   });
    // });
    describe('DELETE', function() {
      var body;
      before(function(done) {
        chai.request('localhost:3000')
          .del('/api/users/' + newUsers.emitted.fulfill[0]._id)
          .end(function(err, res) {
            body = res.body;
            done();
          });
      });

      it('deletes an existing user', function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.length).to.eq(1);
            done();
          });
      });
      it('responds with the message \'user removed\'', function() {
        expect(body.msg).to.eql('user removed');
      });
    });
  });
  // describe('with no existing users', function() {
  //   describe('GET', function() {
  //     it('returns an empty array', function() {

  //     });
  //   });
  //   describe('POST', function() {
  //     it('adds a new user', function() {

  //     });
  //   });
  //   describe('PUT', function() {
  //     it('returns error message', function() {

  //     });
  //   });
  //   describe('PATCH', function() {
  //     it('returns error message', function() {

  //     });
  //   });
  //   describe('DELETE', function() {
  //     it('returns error message', function() {

  //     });
  //   });
  // });
});

