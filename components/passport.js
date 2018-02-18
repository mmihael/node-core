var config = require('./../configrc');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./../model/User');
var bcrypt = require('bcrypt');

var strategies = {
    jwt: function () {
        return new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret'
            },
            function (jwtPayload, done) {
                User.findOne({ where: {email: jwtPayload.email} }).
                    then(user => {
                        if (user) { return done(null, user); }
                        else { return done(null, false); }
                    })
                    .catch(err => done(err));
            }
        )
    },
    cookie: function () {
        return new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            function(email, password, done) {
                User.findOne({ where: {email} }).
                    then(user => {
                        if (user == null) {
                            return done(null, false);
                        } else {
                            bcrypt.compare(password, user.password, function(err, valid) {
                                if (err != null) {
                                    return done(err);
                                } else if (!valid) {
                                    return done(null, false);
                                } else {
                                    return done(null, user);
                                }
                            });
                        }
                    })
                    .catch(err => done(err));
            }
        )
    }
};

passport.use(strategies[config.auth.strategy]());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

module.exports = passport;