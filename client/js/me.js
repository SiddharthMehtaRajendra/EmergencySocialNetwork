import axios from 'axios';
import socket from './socket/config';
import { API_PREFIX, SERVER_ADDRESS } from './constant/serverInfo';
import Cookie from 'js-cookie';
import '../style/me.less';

function logout() {
    Cookie.remove('token');
    window.state = {};
    socket.close();
    window.location.hash = '/';
}

async function fetchData() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/`);
    if (res.status === 200 && res.data.success && res.data.user) {
        window.state.user = res.data.user;
    }
}

async function render() {
    if (!window.state.user) {
        await fetchData();
    }
    if (window.state.user) {
        const user = window.state.user;
        if (user.avatar.indexOf('#') === 0) {
            document.getElementById('page-me-avatar').style.backgroundColor = user.avatar;
            document.getElementById('page-me-avatar').innerText = user.username[0];
        }
        document.getElementById('page-me-username').innerText = user.username;
        document.getElementById('page-me-status').innerText = user.status;
        document.getElementById('logout-menu').addEventListener('click', logout);
        document.getElementById('user-guide-entrance').addEventListener('click', function () {
            window.location.hash = '/guide';
        });
    }
}

const me = {
    fetchData,
    render
};

export default me;
