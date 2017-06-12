var express = require('express');
var router = express.Router();
var User = require('./../models/user');

//router.use(require('./../utils/secure').CookieSession);

router.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err != null) {
      res.statusCode = 500;
      return res.json({ message: 'Server error' });
    }
    res.json({ entities: users });
  });
});

module.exports = router;

