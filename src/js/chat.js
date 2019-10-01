import socket from './socket/config';
import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import dateFormat from './lib/dateFormat';
const pageSize = 20;

async function getHistoryMessage() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/historyMessage`, {
        params: {
            smallestMessageId: Infinity,
            pageSize: pageSize,
            chatId: 0
        }
    });
    return processMessages(res.data.messages);
}

function processMessages(msgList) {
    for (let i = 0; i < msgList.length; i++) {
        msgList[i].fromMe = msgList[i].from === (window.state.user && window.state.user.username);
        msgList[i].time = dateFormat(msgList[i].time, 'mm/dd HH:MM');
        msgList[i].status = window.state.userMap[msgList[i].from].status.toLowerCase();
        msgList[i].avatar = window.state.userMap[msgList[i].from].avatar;
    }
    return msgList;
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
    if (msg.fromMe) {
        singleBubble.classList.add('from-me');
    }
    const avatarContainer = createAvatar(msg);
    const messageContainer = createMessageContainer(msg);
    singleBubble.appendChild(avatarContainer);
    singleBubble.appendChild(messageContainer);
    return singleBubble;
}

function sendMessage() {
    const content = document.getElementById('message-input').value;
    if (content && content.length > 0) {
        socket.emit('MESSAGE', {
            content: content,
            type: 0,
            to: 0,
            chatId: 0
        });
        document.getElementById('message-input').value = '';
    }
}

function renderOneMessage(msg) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    const blankBubble = document.getElementById('blank-bubble');
    bubbleWrap.insertBefore(createSingleBubble(msg), blankBubble);
}

function renderMessages(msgList) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    const blankBubble = document.getElementById('blank-bubble');
    for (let i = 0; i < msgList.length; i++) {
        bubbleWrap.insertBefore(createSingleBubble(msgList[i]), blankBubble);
    }
}

async function render() {
    if (window.location.hash.indexOf('public') >= 0) {
        document.getElementById('single-chat-navbar-title').innerText = 'Public Wall';
    }
    document.getElementById('navbar-back-arrow').addEventListener('click', function () {
        window.history.go(-1);
    });
    renderMessages(await getHistoryMessage());
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

const chat = {
    render,
    getHistoryMessage,
    renderOneMessage
};

export default chat;
