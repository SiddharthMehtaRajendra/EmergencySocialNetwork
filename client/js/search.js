import Search from "../view/search.html";
import "../style/search.less";
import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import chat from "./chat";
import directory from "./directory";
import announcements from "./announcements";
import processMessage from "./lib/processMessage";

const pageSize = 3;

const getContext = function () {
    const context = window.location.hash.split("/").pop();
    window.state.context = context;
    return context;
};

const addSearchOptionListener = function () {
    const privateSearchNode = document.getElementById("private-checkbox");
    const publicSearchNode = document.getElementById("public-checkbox");
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

const setupNavBar = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
    const context = getContext();
    if(context === "message") {
        document.getElementById("search-options").style.display = "flex";
        document.getElementById("result-content").style.top = "160px";
        addSearchOptionListener();
    } else {
        document.getElementById("search-options").style.display = "none";
        document.getElementsByClassName("main-component")[0].style.marginBottom = 0;
        document.getElementById("result-content").style.top = "120px";
    }
};

const getMessageSearchType = function () {
    const privateSearchNode = document.getElementById("private-checkbox");
    const publicSearchNode = document.getElementById("public-checkbox");
    if(publicSearchNode.value === "selected") {
        return "public";
    } else if(privateSearchNode.value === "selected") {
        return "private";
    }
    return null;
};

const updateViewMore = function () {
    const loadMoreDom = document.getElementById("load-more-or-end");
    if(!window.state.isSearchEnd) {
        loadMoreDom.style.visibility = "visible";
    } else {
        loadMoreDom.style.visibility = "hidden";
    }
};

const renderSearchResult = function (context, data) {
    const container = document.getElementById("content-list");
    const beforeNode = document.getElementById("blank-list-item");
    switch (context) {
    case "message":
        if(data.messages && data.messages.length > 0) {
            chat.renderMessages(processMessage(data.messages), container, beforeNode);
            window.state.smallestSearchId = (data.messages[data.messages.length - 1] && data.messages[data.messages.length - 1].id) || Infinity;
        }
        break;
    case "announcement":
        if(data.announcements && data.announcements.length > 0) {
            announcements.renderAnnouncements(data.announcements, container, beforeNode);
            window.state.smallestSearchId = (data.announcements[data.announcements.length - 1] && data.announcements[data.announcements.length - 1].announcementId) || Infinity;
        }
        break;
    case "user":
        container.innerHTML = null;
        directory.renderUsers(data.users, container);
        break;
    default:
        break;
    }
    updateViewMore();
};

const resetContainer = function () {
    document.getElementById("content-list").innerHTML = "<div class='_blank_80height' id='blank-list-item'></div>";
};

const searchData = async function () {
    const keywords = document.getElementById("search-input").value;
    const context = getContext();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/search`, {
        params: {
            keywords: keywords,
            smallestSearchId: window.state.smallestSearchId || Infinity,
            pageSize: pageSize,
            username: window.state.user.username,
            context: context,
            type: getMessageSearchType()
        }
    });
    window.state.searchResult = res.data;
    window.state.isSearchEnd = res.data.end !== false;
    renderSearchResult(context, res.data);
};

const newSearch = async function(){
    resetContainer();
    window.state.smallestSearchId = Infinity;
    await searchData();
};

const addLoadMoreEventListener = function () {
    const loadMoreDom = document.getElementById("load-more-or-end");
    loadMoreDom.addEventListener("click", searchData);
};

const addSearchListener = function () {
    document.getElementById("search-icon").addEventListener("click", newSearch);
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Search;
    setupNavBar();
    window.state.smallestSearchId = Infinity;
    window.state.isSearchEnd = true;
    addSearchListener();
    addLoadMoreEventListener();
};

const search = {
    render
};

export default search;
