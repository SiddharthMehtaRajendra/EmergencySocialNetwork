import axios from 'axios';
import { validateUserName, validatePassword } from './lib/validation';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import Toast from './lib/toast';
import BottomPopCard from '../components/bottomPopCard';
const Cookie = require('js-cookie');

function initJoinPage() {
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', join);
    BottomPopCard.init('Are you sure to create a new user with this username?', register);
}

function buildBottomPopCardContent(username) {
    const usernameDom = document.createElement('div');
    usernameDom.id = 'join-page-username';
    usernameDom.innerText = username;
    return usernameDom;
}

function resetData() {
    Cookie.remove('token');
    window.state = {};
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/join`, {
        username: username,
        password: password
    }).then((res) => {
        if (res.status === 200 && res.data && res.data.success) {
            resetData();
            Cookie.set('token', res.data.token, { expires: 1 });
            Toast(res.data.message);
            setTimeout(function () { window.location.hash = '/welcome'; }, 1000);
        } else {
            Toast(res.data.message);
        }
    });
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
            if (res.status === 200 && res.data) {
                if (res.data.success && res.data.exists && res.data.validationPass) {
                    resetData();
                    Cookie.set('token', res.data.token, { expires: 1 });
                    window.location.hash = '/directory';
                } else if (!res.data.success && res.data.exists === false && res.data.validationPass === null) {
                    BottomPopCard.setContent(buildBottomPopCardContent(username));
                    BottomPopCard.show();
                } else if (!res.data.success && res.data.validationPass === false) {
                    Toast(res.data.message, '#F41C3B');
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

export default initJoinPage;
