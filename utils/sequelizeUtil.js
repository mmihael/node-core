var util = {
    extractErrors: function (err) {
        var errors = {};
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach(error => {
                errors[error.path] = error.message;
            });
        }
        return errors;
    }
};

module.exports = util;