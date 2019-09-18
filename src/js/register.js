import axios from 'axios';
import { validateUserName, validatePassword, validateConfirmPassword } from './lib/validation';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import Toast from './lib/toast';

function initRegisterHandler() {
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', register);
}

function register() {
    const usernameHint = document.getElementById('username-hint');
    const passwordHint = document.getElementById('password-hint');
    const confirmPasswordHint = document.getElementById('confirm-password-hint');
    function resetHint() {
        usernameHint.innerText = '';
        passwordHint.innerText = '';
        confirmPasswordHint.innerText = '';
    }
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const usernameValidation = validateUserName(username);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
    if (usernameValidation.result && passwordValidation.result && password === confirmPassword) {
        resetHint();
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/register`, {
            username: username,
            password: password
        }).then((res) => {
            if (res.status === 200 && res.data && res.data.success) {
                Toast('Register Success!', null, null, 1000);
                setTimeout(() => { window.location.hash = '/welcome'; }, 1000);
            } else {
                console.log('Failed to create an account');
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
        if (!confirmPasswordValidation.result) {
            confirmPasswordHint.innerText = confirmPasswordValidation.text;
        }
    }
}

export default initRegisterHandler;
