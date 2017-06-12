var config = require('./../configrc');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);
mongoose.connection.on('error', function (err) {
  console.log(err);
});
module.exports = mongoose;