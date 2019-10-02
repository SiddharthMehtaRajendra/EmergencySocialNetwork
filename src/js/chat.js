import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import socket from './socket/config';

const getHistoryMessage = new Promise((resolve, reject) => {
    axios({
        url: `${SERVER_ADDRESS}${API_PREFIX}/public-chats`
    }).then((res) => {
        const messages = (res && res.data && res.data.messages) || [];
        resolve(messages);
    }).catch((err) => {
        console.log(err);
        reject(err);
    });
});

function createAvatar(msg) {
    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.innerText = msg.from[0];
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
        const message = {
            from: window.state.user.username,
            to: 'public',
            type: 'public',
            content: content,
            status: window.state.user.status
        };
        socket.emit('MESSAGE', message, (error) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message delivered!');
        });
        document.getElementById('message-input').value = '';
        document.getElementById('message-input').focus();
    }
}

function renderOneMessage(msg) {
    createSingleBubble(msg);
}

async function renderBubbleList(msgList) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    for (let i = 0; i < msgList.length; i++) {
        bubbleWrap.appendChild(createSingleBubble(msgList[i]));
    }
    const blankBubble = document.createElement('div');
    blankBubble.id = 'blank-bubble';
    bubbleWrap.appendChild(blankBubble);
}

async function render() {
    if (window.location.hash.indexOf('public') >= 0) {
        document.getElementById('single-chat-navbar-title').innerText = 'Public Wall';
    }
    document.getElementById('navbar-back-arrow').addEventListener('click', function () {
        window.history.go(-1);
    });
    const messageList = await getHistoryMessage;
    await renderBubbleList(messageList);
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
