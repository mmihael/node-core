var mongooseUtil = require('./../utils/mongoose');
var User = require('./../models/user');
var expect = require('chai').expect;

describe('getValidationErrors', function () {
  it('should extract validation errors from error object', function () {

    var user = new User({});
    var err = mongooseUtil.getValidationErrors(user.validateSync());
    expect(err).to.be.a('object');
    expect(err).to.have.property('email').and.to.equal('Email is required');
    expect(err).to.have.property('password').and.to.equal('Password is required');

    var user = new User({ email: 'invalid_mail', password: 'password' });
    var err = mongooseUtil.getValidationErrors(user.validateSync());
    expect(err).to.be.a('object');
    expect(err).to.have.property('email').and.to.equal('Invalid email');
    expect(err).not.to.have.property('password');

    var user = new User({ email: 'valid@mail.com', password: 'password' });
    var err = mongooseUtil.getValidationErrors(user.validateSync());
    expect(err).to.equal(null);

  });
});