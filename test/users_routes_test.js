'use strict';

// Models & Setup
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var fs = require('fs');
var path = require('path');
var User = require('../models/User.js');

// Start Server
require('../server.js');

describe('Users', function() {
  describe('with existing users', function() {
    // Populate database
    var newUsers;
    before(function(done) {
      newUsers = User.create({username: 'joe', email: 'joe@joe.com', passtoken: '1234'}, function(err, data) {
        newUsers = data;
        done();
      });
    });
    // Clean database
    after(function(done) {
      fs.readdir('./data', function(err, files) {
        if (files.length === 0) { done(); }
        files.forEach(function(elem, index, origArr) {
          User.remove( (path.basename(elem, '.json')), function(){} );
          if (files.length -1 === index) { done(); }
        });
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
        expect(users.length).to.eq(1);
      });
      it('returns multiple users\' usernames', function(){
        expect(users[0].username).to.eql('joe');
      });
      it('returns the users\'  emails', function() {
        expect(users[0].email).to.eql('joe@joe.com');
      });
      it('returns the users\'  passtokens', function() {
        expect(users[0].passtoken).to.eql('1234');
      });
    });

    // PATCH first, because PUT modifies the DB User
    describe('PATCH', function() {
      var resMsg;
      before(function(done) {
        chai.request('localhost:3000')
          .patch('/api/users/1')
          .send({'username': 'joseph', 'email':'joseph@joe.com'})
          .end(function(err, res) {
            resMsg = res.body.msg;
            done();
          });
      });
      it('returns a success message on successful update', function() {
        expect(resMsg).to.eq('success');
      });
      it('updates only the specified fields of a user', function(done) {
         chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            console.log('BODY: ',res.body[0]);
            expect(res.body[0].username).to.eq('joseph');
            expect(res.body[0].email).to.eq('joseph@joe.com');
            expect(res.body[0].passtoken).to.eq('1234');
            done();
          });
      });
    });

    describe('PUT', function() {
      before(function(done) {
        chai.request('localhost:3000')
          .put('/api/users/1')
          .send({'username': 'joseph', 'email':'joseph@joe.com'})
          .end(function(err, res) {
            done();
          });
      });
      it('updates ALL fields of a user to what is passed (can overwrite fields)', function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            expect(res.body[0].email).to.eq('joseph@joe.com');
            expect(res.body[0].passtoken).to.eql(undefined);
            done();
          });
      });
    });

    describe('DELETE', function() {
      var body;
      before(function(done) {
        chai.request('localhost:3000')
          .del('/api/users/1')
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
            expect(res.body.length).to.eq(0);
            done();
          });
      });
      it('responds with the message \'user removed\'', function() {
        expect(body.msg).to.eql('user removed');
      });
    });
  });


  describe('with no existing users', function() {
    before(function(done) {
      done();
    });
    after(function(done) {
      fs.readdir('./data', function(err, files) {
        if (files.length === 0) { done(); }
        files.forEach(function(elem, index, origArr) {
          User.remove( (path.basename(elem, '.json')), function(){} );
          if (files.length -1 === index) { done(); }
        });
      });
    });

    describe('GET', function() {
      it('returns an empty array', function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.length).to.eq(0);
            done();
          });
      });
    });

    describe('POST', function() {
      var resMsg;
      before(function(done) {
        chai.request('localhost:3000')
          .post('/api/users')
          .send({username: 'joe', email: 'joe@joe.com', passtoken: '1234'})
          .end(function(err, res) {
            resMsg = res.body.msg;
            done();
          });
      });

      it('user creation returns a success message', function() {
        expect(resMsg).to.eq('success');
      });
      it('creates a new user', function(done) {
        chai.request('localhost:3000')
          .get('/api/users')
          .end(function(err, res) {
            expect(res.body.length).to.eq(1);
            expect(res.body[0].username).to.eq('joe');
            done();
          });
      });
    });
  });
});

