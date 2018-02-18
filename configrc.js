var config = require('rc')( process.env.NODE_ENV === 'test' ? 'test' : 'app', {
    port: 3000,
    db: { host: '127.0.0.1', username: 'vagrant', password: 'vagrant', database: 'core', dialect: 'mysql' },
    auth: { strategy: "jwt" }
});

module.exports = config;