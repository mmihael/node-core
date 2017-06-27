process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./../index');
var should = chai.should();
var User = require('./../models/user');
chai.use(chaiHttp);

describe('User api', function () {

  describe('user list', function () {
    it('get all users', function (done) {
      chai.request(server).get('/user').end(function (err, res) {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').and.to.equal('Unauthorized');
        done();
      });
    });
  });

});