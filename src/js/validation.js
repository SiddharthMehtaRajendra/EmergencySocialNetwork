import reservedNameDict from './reservedUserNames';
import * as errorTextConfig from './errorTextConfig.json';

const validateUserName = (username) => {
    try {
        if (username.length < 3) {
            return { result: false, text: errorTextConfig.registrationErrors.userNameLengthError };
        }
        if (reservedNameDict && reservedNameDict[username]) {
            return { result: false, text: errorTextConfig.registrationErrors.userNameReserved };
        }
    } catch (e) {
        console.log(e);
        return { result: false, text: errorTextConfig.exceptions.processingError };
    }
    return { result: true, text: '' };
};

const validatePassword = (password) => {
    try {
        if (password.length < 4) {
            return { result: false, text: errorTextConfig.registrationErrors.passwordLengthError };
        }
    } catch (e) {
        console.log(e);
        return { result: false, text: errorTextConfig.exceptions.processingError };
    }
    return { result: true, text: '' };
};

export { validateUserName, validatePassword };
