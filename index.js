const config = require('./configrc');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./components/passport');

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

app.use({
    jwt: require('./utils/secure').JWT,
    cookie: require('./utils/secure').CookieSession
}[config.auth.strategy]);

app.use('/user', require('./routes/user'));

app.listen(config.port, function () { console.log('Started listening...'); });

module.exports = app;