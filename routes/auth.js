var config = require('./../configrc');
var sequelizeUtil = require('./../utils/sequelizeUtil');
var router = require('express').Router();
var User = require('./../model/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var passport = require('passport');

if (config.auth.strategy === 'jwt') {
    router.post('/jwt', function (req, res) {
        var resJson = {
            message: 'Server error',
        };
        User.findOne({ where: { email: req.body.email } })
            .then((user) => {
                if (user == null) {
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
                            return res.json(jwt.sign({ email: user.email }, 'secret'));
                        }
                    });
                }
            })
            .catch(err => {
                res.statusCode = 500;
                return res.json(resJson);
            });
    });
} else if (config.auth.strategy === 'cookie') {
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
}

router.get('/status', function (req, res) {
    res.json({
        user: req.user,
        auth: req.isAuthenticated()
    });
});

router.post('/register', function (req, res) {

    var resJson = {
        message: 'User created'
    };

    if (
        req.body &&
        req.body.password &&
        typeof req.body.password === 'string' &&
        req.body.password.length > 4 &&
        req.body.password.length <= 255
    ) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    User.create(req.body)
        .then(user => {
            resJson.user = user.dataValues;
            return res.json(resJson);
        })
        .catch(err => {
            var validationErrors = sequelizeUtil.extractErrors(err);
            if (Object.keys(validationErrors).length > 0) {
                res.statusCode = 422;
                resJson.message = 'Invalid data';
                resJson.validationErrors = validationErrors;
                return res.json(resJson);
            } else {
                res.statusCode = 500;
                resJson.message = 'Error occurred';
                return res.json(resJson);
            }
        });
});

module.exports = router;

