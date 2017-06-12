var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./../models/user');
var bcrypt = require('bcrypt');

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
  },
  function (jwtPayload, done) {
    User.findOne({email: jwtPayload.email}, function(err, user) {
      if (err) { return done(err); }
      if (user) { return done(null, user); }
      else { return done(null, false); }
    });
  }
));

//passport.use(new LocalStrategy(
//  { usernameField: 'email', passwordField: 'password' },
//  function(email, password, done) {
//    User.findOne({ email: email }, function (err, user) {
//      if (err != null) {
//        return done(err);
//      } else if (user == null) {
//        return done(null, false);
//      } else {
//        bcrypt.compare(password, user.password, function(err, valid) {
//          if (err != null) {
//            return done(err);
//          } else if (!valid) {
//            return done(null, false);
//          } else {
//            return done(null, user);
//          }
//        });
//      }
//    });
//  }
//));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;