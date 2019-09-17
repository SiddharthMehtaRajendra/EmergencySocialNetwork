import axios from 'axios';
import { validateUserName, validatePassword } from './validation';
import { SERVER_ADDRESS, API_PREFIX } from './constant';

function initRegisterHandler() {
    const registerBtn = document.getElementById('register-btn');
    const $username = document.getElementById('username');
    const $password = document.getElementById('password');
    registerBtn.addEventListener('click', (e) => {
        const userValidation = validateUserName($username.value);
        const passwordValidation = validatePassword($password.value);
        if (userValidation.result !== false && passwordValidation.result !== false) {
            axios.post(`${SERVER_ADDRESS}${API_PREFIX}/registerUser`, {
                username: $username.value,
                password: $password.value
            }).then((res) => {
                console.log(res);
                document.getElementById('api-result').innerText = JSON.stringify(res.data);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            if (userValidation && userValidation.text) {
                /* Append Username Errors Here* TODO: Yi Wang */
            }
            if (passwordValidation && passwordValidation.text) {
                /* Append Passwords Error Here* TODO: Yi Wang */
            }
        }
    });
}

export default initRegisterHandler;
