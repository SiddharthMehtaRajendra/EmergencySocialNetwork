import axios from 'axios';
import { validateUserName, validatePassword } from './lib/validation';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import Toast from './lib/toast';

function initJoinHandler() {
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', join);
}

function join() {
    const usernameHint = document.getElementById('username-hint');
    const passwordHint = document.getElementById('password-hint');

    function resetHint() {
        usernameHint.innerText = '';
        passwordHint.innerText = '';
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usernameValidation = validateUserName(username);
    const passwordValidation = validatePassword(password);
    if (usernameValidation.result && passwordValidation.result) {
        resetHint();
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/joinCheck`, {
            username: username,
            password: password
        }).then((res) => {
            // TODO: User Exist and pass the validation, should go into system
            if (res.status === 200 && res.data) {
                if (res.data.success && res.data.exists && res.data.validationPass) {
                    window.location.hash = '/home';
                } else if (!res.data.success && res.data.exists === false && res.data.validationPass === null) {
                    console.log('want to create an account');
                } else if (!res.data.success && res.data.validationPass === false) {
                    Toast(res.data.message);
                }
            }
        }).catch((err) => {
            Toast(err.toString(), '#F41C3B');
            console.log(err);
        });
    } else {
        resetHint();
        if (!usernameValidation.result) {
            usernameHint.innerText = usernameValidation.text;
        }
        if (!passwordValidation.result) {
            passwordHint.innerText = passwordValidation.text;
        }
    }
}

export default initJoinHandler;
