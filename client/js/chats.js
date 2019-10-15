import '../style/chats.less';
import Chats from '../view/chats.html';
import axios from 'axios';
import { API_PREFIX, SERVER_ADDRESS } from './constant/serverInfo';

async function fetchData() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/chats`);
    console.log(res);
    if (res.status === 200 && res.data.success && res.data.users) {
        const chats = res.data.users;
        window.state.chats = chats;
        const chatsMap = {};
        for (let i = 0; i < chats.length; i++) {
            chatsMap[chats[i].id] = chats[i];
        }
        window.state.chatsMap = chatsMap;
    }
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = Chats;
    document.getElementById('public-chat-entrance').addEventListener('click', function () {
        window.location.hash = '/chat/public';
    });
    document.getElementById('annie-chat').addEventListener('click', function () {
        window.location.hash = '/chat/annie';
    });
}

const chats = {
    render,
    fetchData
};

export default chats;
