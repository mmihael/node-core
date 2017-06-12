var mongoose = require('./../components/mongoose');
var mongooseUtil = require('./../utils/mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;

var schema = mongooseUtil.getDefaultSchemaFields();

schema.email = {
  type: String,
  index: { unique: true },
  validate: {
    validator: function (val) { return validator.isEmail(val); },
    message: 'Invalid email'
  },
  required: [true, 'Email is required']
};

schema.password = {
  type: String,
  required: [true, 'Password is required']
};

userSchema = new Schema(schema);

module.exports = mongoose.model('user', userSchema);