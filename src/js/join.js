import axios from 'axios';
import { validateUserName, validatePassword } from './lib/validation';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import Toast from './lib/toast';
<<<<<<< HEAD
import { bottomPopCardSetup, showBottomPopCard, setupContent } from '../components/bottomPopCard';
import Cookies from 'js-cookie';
// import socket from './socket.js';
=======
import BottomPopCard from '../components/bottomPopCard';
import socket from './socket/config';
const Cookie = require('js-cookie');
>>>>>>> origin/public-wall-dev

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

function reset() {
    Cookie.remove('token');
    window.state = {};
    socket.close();
}

function setToken(token) {
    Cookie.set('token', token, { expires: 1 });
    window.state.token = token;
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/join`, {
        username: username,
        password: password
    }).then((res) => {
        if (res.status === 200 && res.data && res.data.success) {
            reset();
            setToken(res.data.token);
            socket.open();
            Toast(res.data.message);
            // socket.connect();
            setTimeout(function () {
                window.location.hash = '/welcome';
            }, 1000);
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
        axios({
            method: 'post',
            url: `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`,
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }).then((res) => {
<<<<<<< HEAD
            // login successfully
            // TODO: User Exist and pass the validation, should go into system
            if (res.status === 200 && res.data) {
                if (res.data.success && res.data.exists && res.data.validationPass) {
                    Cookies.set('token', res.data.token);
                    // socket.connect();
                    axios({
                        method: 'post',
                        url: `${SERVER_ADDRESS}${API_PREFIX}/updateStatus`,
                        data: {
                            username: username,
                            status: 'online'
                        },
                        withCredentials: true
                    });
                    window.location.hash = '/directory';
                } else if (!res.data.success && res.data.exists === false && res.data.validationPass === null) {
                    // ready for registeration
                    setupContent(buildBottomPopCardContent(username));
                    showBottomPopCard();
=======
            if (res.status === 200 && res.data) {
                if (res.data.success && res.data.exists && res.data.validationPass) {
                    reset();
                    setToken(res.data.token);
                    socket.open();
                    window.location.hash = '/directory';
                } else if (!res.data.success && res.data.exists === false && res.data.validationPass === null) {
                    BottomPopCard.setContent(buildBottomPopCardContent(username));
                    BottomPopCard.show();
>>>>>>> origin/public-wall-dev
                } else if (!res.data.success && res.data.validationPass === false) {
                    // username and password are not matched
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
