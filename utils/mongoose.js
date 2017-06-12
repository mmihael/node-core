var Schema = require('mongoose').Schema;
var _ = require('lodash');

var util = {

  getValidationErrors: function (err) {
    if (err != null && err.errors != null) {
      var errors = {};
      _.forIn(err.errors, function (val, key) {
        errors[key] = val.message;
      });
      return errors;
    }
    return null;
  },

  getDefaultSchemaFields: function () {
    return {
      createdAt: {
        type: Date,
        default: Date.now
      },
      editedAt: {
        type: Date,
        default: Date.now
      },
      deletedAt: {
        type: Date,
        default: null
      },
      createdBy: {
        type: Schema.Types.ObjectId
      },
    };
  }

};

module.exports = util;