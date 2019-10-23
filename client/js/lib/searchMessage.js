import SearchMessage from '../../view/searchMessage.html';
import '../../style/searchMessage.less';
import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from '../constant/serverInfo';
import processMessage from './processMessage';

function addArrowBackListener() {
    document.getElementsByClassName('navbar-back-arrow')[0].addEventListener('click', function () {
        window.history.go(-1);
    });
}

function renderMessages(msgList) {
    console.log(msgList);
    const bubbleWrap = document.getElementById('bubble-wrap');
    const smallestMessageId = window.state.smallestMessageId || Infinity;
    let beforeNode;
    if (window.state.smallestMessageId === Infinity) {
        beforeNode = document.getElementById('blank-bubble');
    } else {
        beforeNode = document.getElementById(`message-${smallestMessageId}`);
    }
    for (let i = 0; i < msgList.length; i++) {
        bubbleWrap.insertBefore(createSingleBubble(msgList[i]), beforeNode);
    }
    window.state.smallestMessageId = (msgList[0] && msgList[0].id) || 0;
}

function createAvatar(msg) {
    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.innerText = msg.from[0];
    avatar.style.backgroundColor = msg.avatar;
    const statusDot = document.createElement('div');
    statusDot.className = `bubble-status-dot ${msg.status}`;
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';
    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(statusDot);
    return avatarContainer;
}

function createMessageContainer(msg) {
    const message = document.createElement('div');
    message.className = `bubble-message ${msg.status}`;
    const nameTimeContainer = document.createElement('div');
    nameTimeContainer.className = 'bubble-name-time';
    const name = document.createElement('div');
    name.className = 'name';
    name.innerText = msg.from;
    const time = document.createElement('div');
    time.className = 'time';
    time.innerText = msg.time;
    nameTimeContainer.appendChild(name);
    nameTimeContainer.appendChild(time);
    const content = document.createElement('div');
    content.className = 'content';
    content.innerText = msg.content;
    message.appendChild(nameTimeContainer);
    message.appendChild(content);
    return message;
}

function createSingleBubble(msg) {
    const singleBubble = document.createElement('div');
    singleBubble.className = 'single-bubble';
    singleBubble.id = `message-${msg.id}`;
    if (msg.fromMe) {
        singleBubble.classList.add('from-me');
    }
    const avatarContainer = createAvatar(msg);
    const messageContainer = createMessageContainer(msg);
    singleBubble.appendChild(avatarContainer);
    singleBubble.appendChild(messageContainer);
    return singleBubble;
}

function showResult(res) {
    console.log(res.data);
    const searchResult = processMessage(res.data.messages);
    console.log(searchResult);
    renderMessages(searchResult);
}

async function getSearchResult() {
    const content = document.getElementById('search-message').value;
    console.log(content);
    if (content && content.length > 0) {
        const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/searchPublicMessage`, {
            searchMessage: content
        });
        if (res) {
            showResult(res);
        }
        document.getElementById('search-message').value = '';
    }
}

function addSearchIconListener() {
    document.getElementsByClassName('message-search-icon')[0].addEventListener('click', function () {
        document.getElementById('bubble-wrap').innerHTML = '';
        getSearchResult();
    });
}

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = SearchMessage;
    addArrowBackListener();
    addSearchIconListener();
}

const search = {
    render
};

export default search;
