import SearchUser from "../../view/searchUser.html";
import "../../style/searchUser.less";
import axios from "axios";
import Utils from "./appUtils.js";
import { SERVER_ADDRESS, API_PREFIX } from "../constant/serverInfo";

function addArrowBackListener() {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function createSingleUser(user) {
    const userCard = document.createElement("div");
    const userAvatar = document.createElement("div");
    const userName = document.createElement("div");
    const userStatus = document.createElement("div");
    userCard.className = "single-user common-list-item";
    userName.className = "username";
    userAvatar.className = "avatar";
    userStatus.className = "status-circle";
    userName.innerText = user.username;
    userAvatar.innerText = user.username.charAt(0);
    userAvatar.setAttribute("style", `background-color: ${user.avatar || "#CCC"};`);
    Utils.renderStatusColor(user.status, userStatus);
    userCard.appendChild(userAvatar);
    userCard.appendChild(userStatus);
    userCard.appendChild(userName);
    return userCard;
}

function renderUsers(userList) {
    const UserLists = document.getElementById("searched-user-list");
    const beforeNode = document.getElementsByClassName("blank-bubble")[0];
    for(let i = 0; i < userList.length; i++) {
        UserLists.insertBefore(createSingleUser(userList[i]), beforeNode);
    }
}

function showResult(res) {
    // const searchResult = processMessage(res.data.users);
    console.log("res.data.users: " + res.data.users);
    renderUsers(res.data.users);
}

function getContextual() {
    return "user";
}

async function getSearchResult() {
    const newContent = document.getElementById("search-user").value;
    if(newContent) {
        window.state.content = newContent;
    }
    const contextual = getContextual();
    console.log(newContent);
    console.log(contextual);
    const content = window.state.content;
    if(content && content.length > 0 && contextual) {
        const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/search/` + contextual, {
            searchUser: content,
            username: window.state.user.username
        });
        console.log(res);
        if(res) {
            showResult(res);
        }
        document.getElementById("search-user").value = "";
    }
}

function addSearchIconListener() {
    document.getElementById("user-search-icon").addEventListener("click", () => {
        removeElementsByClass("single-user");
        getSearchResult();
    });
}

async function render() {
    const app = document.getElementById("app");
    app.innerHTML = SearchUser;
    window.state.content = null;
    addArrowBackListener();
    addSearchIconListener();
    getSearchResult();
}

const searchUser = {
    render
};

export default searchUser;