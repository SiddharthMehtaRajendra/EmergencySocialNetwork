import SearchMessage from '../../view/searchMessage.html';
import '../../style/searchMessage.less';
import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from '../constant/serverInfo';
import processMessage from './processMessage';
// import renderMessages from '../../js/chat';
const maxMessageNum = 9999;

function addArrowBackListener() {
    document.getElementsByClassName('navbar-back-arrow')[0].addEventListener('click', function () {
        window.history.go(-1);
    });
}

function renderMessages(msgList) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    const beforeNode = document.getElementsByClassName('blank-bubble')[0];
    for (let i = 0; i < msgList.length; i++) {
        bubbleWrap.insertBefore(createSingleBubble(msgList[i]), beforeNode);
    }
    window.state.smallestMessageId = (msgList[msgList.length - 1] && msgList[msgList.length - 1].id) || 0;
    console.log(window.state.smallestMessageId);
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
    const searchResult = processMessage(res.data.messages);
    renderMessages(searchResult);
}

async function getSearchResult() {
    const newContent = document.getElementById('search-message').value;
    if (newContent) {
        window.state.content = newContent;
    }
    console.log(window.state.smallestMessageId);
    const content = window.state.content;
    const pageSize = 2;
    if (content && content.length > 0) {
        const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/search/publicMessage`, {
            searchMessage: content,
            smallestMessageId: window.state.smallestMessageId,
            pageSize: pageSize
        });
        if (res.data.end) {
            document.getElementById('show-more').innerText = 'end';
        } else {
            document.getElementById('show-more').innerText = 'view more';
        }
        if (res) {
            showResult(res);
        }
        document.getElementById('search-message').value = '';
        console.log(res);
    }
}

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function addSearchIconListener() {
    document.getElementsByClassName('message-search-icon')[0].addEventListener('click', function () {
        removeElementsByClass('single-bubble');
        window.state.smallestMessageId = maxMessageNum;
        getSearchResult();
    });
}

function addViewMoreListener() {
    document.getElementsByClassName('show-more')[0].addEventListener('click', function () {
        // window.state.smallestMessageId = maxMessageNum;
        getSearchResult();
    });
}

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = SearchMessage;
    window.state.content = null;
    addArrowBackListener();
    addSearchIconListener();
    addViewMoreListener();
}

const search = {
    render
};

export default search;
