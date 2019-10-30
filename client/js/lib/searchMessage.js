import SearchMessage from "../../view/searchMessage.html";
import "../../style/searchMessage.less";
import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "../constant/serverInfo";
import processMessage from "./processMessage";
const maxMessageNum = 9999;

const addArrowBackListener = function() {
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
};

function createAvatar(msg) {
    const avatar = document.createElement("div");
    avatar.className = "bubble-avatar";
    avatar.innerText = msg.from[0];
    avatar.style.backgroundColor = msg.avatar;
    const statusDot = document.createElement("div");
    statusDot.className = `bubble-status-dot ${msg.status}`;
    const avatarContainer = document.createElement("div");
    avatarContainer.className = "avatar-container";
    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(statusDot);
    return avatarContainer;
}

function createMessageContainer(msg) {
    const message = document.createElement("div");
    message.className = `bubble-message ${msg.status}`;
    const nameTimeContainer = document.createElement("div");
    nameTimeContainer.className = "bubble-name-time";
    const name = document.createElement("div");
    name.className = "name";
    name.innerText = msg.from;
    const time = document.createElement("div");
    time.className = "time";
    time.innerText = msg.time;
    nameTimeContainer.appendChild(name);
    nameTimeContainer.appendChild(time);
    const content = document.createElement("div");
    content.className = "content";
    content.innerText = msg.content;
    message.appendChild(nameTimeContainer);
    message.appendChild(content);
    return message;
}

function createSingleBubble(msg) {
    const singleBubble = document.createElement("div");
    singleBubble.className = "single-bubble";
    singleBubble.id = `message-${msg.id}`;
    if(msg.fromMe) {
        singleBubble.classList.add("from-me");
    }
    const avatarContainer = createAvatar(msg);
    const messageContainer = createMessageContainer(msg);
    singleBubble.appendChild(avatarContainer);
    singleBubble.appendChild(messageContainer);
    return singleBubble;
}

function renderMessages(msgList) {
    const bubbleWrap = document.getElementById("bubble-wrap");
    const beforeNode = document.getElementsByClassName("blank-bubble")[0];
    for(let i = 0; i < msgList.length; i++) {
        bubbleWrap.insertBefore(createSingleBubble(msgList[i]), beforeNode);
    }
    window.state.smallestMessageId = (msgList[msgList.length - 1] && msgList[msgList.length - 1].id) || 0;
}

const getContextual = function() {
    const privateSearchNode = document.getElementsByClassName("private-checkbox")[0];
    const publicSearchNode = document.getElementsByClassName("public-checkbox")[0];
    if(publicSearchNode.value === "selected") {
        return "publicMessage";
    } else {
        if(privateSearchNode.value === "selected") {
            return "privateMessage";
        }
        return null;
    }
};

function showResult(res) {
    const searchResult = processMessage(res.data.messages);
    renderMessages(searchResult);
}

const getSearchResult = async function() {
    const newContent = document.getElementById("search-message").value;
    if(newContent) {
        window.state.content = newContent;
    }
    const contextual = getContextual();
    console.log(contextual);
    const content = window.state.content;
    const pageSize = 10;
    if(content && content.length > 0 && contextual) {
        const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/search/` + contextual, {
            searchMessage: content,
            smallestMessageId: window.state.smallestMessageId,
            pageSize: pageSize,
            username: window.state.user.username
        });
        if(res.data.end) {
            const node = document.getElementById("show-more");
            node.innerText = "end";
            node.style.color = "#111";
        } else {
            const node = document.getElementById("show-more");
            node.innerText = "view more";
            node.style.color = "#1983FF";
            // node.style.color = '#111';
        }
        if(res) {
            showResult(res);
        }
        document.getElementById("search-message").value = "";
    }
};

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

const displayShowMoreButton = function(){
    const showMoreNode = document.getElementById("show-more");
    showMoreNode.style.display = "block";
};

function addSearchIconListener() {
    document.getElementsByClassName("message-search-icon")[0].addEventListener("click", () => {
        removeElementsByClass("single-bubble");
        window.state.smallestMessageId = maxMessageNum;
        getSearchResult();
        displayShowMoreButton();
    });
}

const addViewMoreListener = function() {
    document.getElementsByClassName("show-more")[0].addEventListener("click", () => {
        getSearchResult();
    });
};

const addSearchOptionListener = function() {
    const privateSearchNode = document.getElementsByClassName("private-checkbox")[0];
    const publicSearchNode = document.getElementsByClassName("public-checkbox")[0];
    privateSearchNode.addEventListener("click", () => {
        privateSearchNode.style.backgroundColor = "#000";
        publicSearchNode.style.backgroundColor = "#fff";
        privateSearchNode.value = "selected";
        publicSearchNode.value = "unselected";
    });
    publicSearchNode.addEventListener("click", () => {
        publicSearchNode.style.backgroundColor = "#000";
        privateSearchNode.style.backgroundColor = "#fff";
        privateSearchNode.value = "unselected";
        publicSearchNode.value = "selected";
    });
};

const render = async function() {
    const app = document.getElementById("app");
    app.innerHTML = SearchMessage;
    window.state.content = null;
    addArrowBackListener();
    addSearchIconListener();
    addViewMoreListener();
    addSearchOptionListener();
};

const search = {
    render
};

export default search;
