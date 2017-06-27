var config = require('./configrc');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./components/passport');

var app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'core',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use(require('./utils/secure').JWT);
app.use('/user', require('./routes/user'));

app.listen(config.port, function () { console.log('Started listening...'); });

module.exports = app;