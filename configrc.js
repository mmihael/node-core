var config = require('rc')('app', {
  port: 3000,
  mongo: {
    host: 'localhost',
    db: 'core'
  }
});
module.exports = config;