import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/directory.less";
import Directory from "../view/directory.html";
import Utils from "./lib/appUtils";

const fetchData = async function () {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`);
    if(res.status === 200 && res.data.success && res.data.users) {
        const users = res.data.users;
        window.state.users = users;
        const userMap = {};
        for(let i = 0; i < users.length; i++) {
            userMap[users[i].username] = users[i];
        }
        window.state.userMap = userMap;
    }
};

const addSearchListener = function () {
    document.getElementsByClassName("search-icon")[0].addEventListener("click", () => {
        window.location.hash = "/search/user";
    });
};

const addLocationSharingListener = function () {
    document.getElementById("location-sharing-icon").addEventListener("click", () => {
        window.location.hash = "/locationSharing";

    });
};

const buildSingleUser = function (user, clickCallBack) {
    const userCard = document.createElement("div");
    const userName = document.createElement("div");
    const userAvatar = document.createElement("div");
    const userStatus = document.createElement("div");
    userCard.className = "single-user common-list-item";
    userCard.addEventListener("click", clickCallBack);
    userName.className = "username";
    userAvatar.className = "avatar";
    userStatus.className = "status-circle";
    userName.innerText = user.username;
    userAvatar.innerText = user.username.charAt(0);
    userAvatar.setAttribute("style", `background-color: ${user.avatar || "#CCC"};`);
    Utils.renderStatusColor(user.status, userStatus);
    if(!user.online) {
        userCard.classList.add("offline");
    }
    userCard.appendChild(userAvatar);
    userCard.appendChild(userStatus);
    userCard.appendChild(userName);
    return userCard;
};

const buildBottomLine = function () {
    const bottomThinLine = document.createElement("div");
    bottomThinLine.className = "right-thin-line";
    return bottomThinLine;
};

const renderUsers = function (users, container) {
    users.forEach((user, index) => {
        const userCard = buildSingleUser(user, () => {
            window.location.hash = "/chat/" + user.username;
        });
        const bottomThinLine = buildBottomLine();
        if(index !== users.length - 1) {
            container.appendChild(userCard);
            container.appendChild(bottomThinLine);
        } else {
            container.appendChild(userCard);
        }
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Directory;
    const directory = document.getElementById("user-directory");
    if(!window.state.users) {
        await fetchData();
    }
    addSearchListener();
    addLocationSharingListener();
    if(window.state.users && directory) {
        directory.innerHTML = null;
        const users = window.state.users;
        renderUsers(users, directory);
    }
};

const directory = {
    fetchData,
    render,
    renderUsers,
    buildSingleUser,
    buildBottomLine
};

export default directory;
