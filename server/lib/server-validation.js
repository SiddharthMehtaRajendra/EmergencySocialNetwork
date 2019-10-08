const { validateUserName, validatePassword } = require('../../src/js/lib/validation');

const validate = (username, password) => {
    return validateUserName(username).result && validatePassword(password).result;
};

module.exports = validate;
