import socket from './socket/config';

async function getHistoryMessage() {
    return [{
        time: 'time here',
        from: 'tttt',
        to: 'public',
        type: 'text',
        content: 'Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1',
        chatId: '123456',
        fromMe: false,
        status: 'ok'
    }, {
        time: 'time here',
        from: 'Wayne',
        to: 'public',
        type: 'text',
        content: 'Content 2',
        chatId: '123456',
        fromMe: true,
        status: 'help'
    }, {
        time: 'time here',
        from: 'WEEE',
        to: 'public',
        type: 'text',
        content: 'Content 3',
        chatId: '123456',
        fromMe: true,
        status: 'ok'
    }, {
        time: 'time here',
        from: 'tttt',
        to: 'public',
        type: 'text',
        content: 'Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1',
        chatId: '123456',
        fromMe: false,
        status: 'emergency'
    }, {
        time: 'time here',
        from: 'tttt',
        to: 'public',
        type: 'text',
        content: 'Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1Content 1',
        chatId: '123456',
        fromMe: false,
        status: 'ok'
    }];
}

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
    await renderBubbleList(await getHistoryMessage());
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
