const { validateUserName, validatePassword } = require('../src/js/lib/validation');
const User = require('../models/user');

const validateCredentials = async (username, password) => {
    try {
        if(validateUserName(username) && validatePassword(password)) {
            const isNewUser = User.userExists(username)
            if(!isNewUser){
                return await User.validateCredentials(username, password);
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

export {validateCredentials};