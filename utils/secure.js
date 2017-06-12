var passport = require('./../components/passport');

module.exports.CookieSession = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.statusCode = 401;
    return res.json({ message: 'Unauthorized' });
  }
};

module.exports.JWT = function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    res.statusCode = 500;
    var resJson = {
      message: 'Server error',
    };
    if (err != null) { return res.json(resJson); }
    if (!user) {
      res.statusCode = 401;
      return res.json({ message: 'Unauthorized' });
    }
    req.logIn(user, function () {
      next();
    });
  })(req, res, next);
};