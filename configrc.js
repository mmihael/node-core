var config = require('rc')( process.env.NODE_ENV === 'test' ? 'test' : 'app', {
  port: 3000,
  mongo: {
    host: 'localhost',
    db: 'core'
  }
});
module.exports = config;