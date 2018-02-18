var express = require('express');
var router = express.Router();
var User = require('./../model/User');

router.get('/', function (req, res) {
    User.all().then(function (users) {
        res.json({ entities: users });
    }).catch(err => {
        res.statusCode = 500;
        res.json({ message: 'Server error' });
    });
});

module.exports = router;