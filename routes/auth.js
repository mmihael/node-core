var router = require('express').Router();
var User = require('./../models/user');
var jwt = require('jsonwebtoken');
var getValidationErrors = require('../utils/mongoose').getValidationErrors;
var bcrypt = require('bcrypt');
var passport = require('passport');

router.get('/status', function (req, res) {
  res.json({
    user: req.user,
    auth: req.isAuthenticated()
  });
});

router.post('/jwt', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    res.statusCode = 500;
    var resJson = {
      message: 'Server error',
    };
    if (err != null) {
      return res.json(resJson);
    } else if (user == null) {
      res.statusCode = 401;
      resJson.message = 'Invalid email or password';
      return res.json(resJson);
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, valid) {
        if (err != null) {
          return res.json(resJson);
        } else if (!valid) {
          res.statusCode = 401;
          resJson.message = 'Invalid email or password';
          return res.json(resJson);
        } else {
          res.statusCode = 200;
          return res.json(jwt.sign({ email: user.email }, 'secret'));
        }
      });
    }
  });
});

router.post('/login', function (req, res, next) {
  res.statusCode = 500;
  var resJson = {
    message: 'Server error',
  };
  passport.authenticate('local', function (err, user, info) {
    if (err != null) { return res.json(resJson); }
    if (!user) {
       res.statusCode = 406;
       resJson.message = 'Invalid email or password';
       return res.json(resJson);
    }
    req.logIn(user, function () {
      if (err != null) { return res.json(resJson); }
      res.statusCode = 200;
      resJson.message = 'Login success';
      res.json(resJson);
    });
  })(req, res, next);
});

router.get('/logout', function(req, res){
  req.logout();
  res.json({ message: 'Logged out' });
});

router.post('/register', function (req, res) {
  res.statusCode = 422;
  var resJson = {
    message: 'Validation failed',
    validationErrors: {}
  };

  var newUser = new User(req.body);

  var err = newUser.validateSync();

  if (err != null) {
    resJson.validationErrors = getValidationErrors(err);
  }

  if (req.body.password !== req.body.passwordRepeat) {
    resJson.validationErrors.passwordRepeat = 'Passwords don\'t match';

  }

  if (Object.keys(resJson.validationErrors).length > 0) {
    return res.json(resJson);
  }

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err != null) {
      res.statusCode = 500;
      resJson.message = 'Error occurred';
      return res.json(resJson);
    } else {
      newUser.password = hash;
      newUser.save(function (err, user) {
        if (err) {
          if (err.code != null && err.message != null && err.code === 11000) {
            if (err.message.indexOf('$email') != -1) {
              resJson.validationErrors.email = 'Email not unique';
              return res.json(resJson);
            }
          }
          resJson.validationErrors = getValidationErrors(err);
        } else {
          res.statusCode = 201;
          resJson.message = 'User created';
          resJson.user = user.toObject();
          delete resJson.user.password;
        }
        return res.json(resJson);
      });
    }
  });
});

module.exports = router;

