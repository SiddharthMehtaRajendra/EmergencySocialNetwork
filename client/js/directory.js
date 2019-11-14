import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/directory.less";
import Directory from "../view/directory.html";
import Utils from "./lib/appUtils";

const getDirectoryDisplayType = function () {
    const allDisplayNode = document.getElementById("all-checkbox");
    const doctorDisplayNode = document.getElementById("doctor-checkbox");
    if(doctorDisplayNode.value === "selected") {
        console.log("getDirectoryDisplayType: doctor");
        return "doctor";
    } else if(allDisplayNode.value === "selected") {
        console.log("getDirectoryDisplayType: all");
        return "all";
    }
    return null;
};

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

const fetchDoctorData = async function () {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`, {
        params: {
            type: getDirectoryDisplayType()
        }
    });
    console.log("fetchDoctorData: ");
    console.log(res.data.users);
    // const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`);
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

const genDisplayNodeEventListener = function (node, otherNode) {
    return () => {
        node.style.backgroundColor = "#000";
        otherNode.style.backgroundColor = "#fff";
        node.value = "selected";
        otherNode.value = "unselected";
    };
};

const addSearchListener = function () {
    document.getElementsByClassName("search-icon")[0].addEventListener("click", () => {
        window.location.hash = "/search/user";
    });
};

const resetDirectory = function () {
    document.getElementById("directory-list").innerHTML = "<div class='content' id='user-directory'></div>";
};

const renderUsers = function (users, container) {
    console.log("rendering");
    users.forEach((user, index) => {
        const userCard = document.createElement("div");
        const userName = document.createElement("div");
        const userAvatar = document.createElement("div");
        const userStatus = document.createElement("div");
        const bottomThinLine = document.createElement("div");
        console.log("rendering user:" + user.username);
        userCard.className = "single-user common-list-item";
        userCard.addEventListener("click", () => {
            window.location.hash = "/profile/" + user.username;
        });
        userName.className = "username";
        userAvatar.className = "avatar";
        userStatus.className = "status-circle";
        bottomThinLine.className = "right-thin-line";
        userName.innerText = user.username;
        userAvatar.innerText = user.username.charAt(0);
        userAvatar.setAttribute("style", `background-color: ${user.avatar || "#CCC"};`);
        Utils.renderStatusColor(user.status, userStatus);
        userCard.appendChild(userAvatar);
        userCard.appendChild(userStatus);
        userCard.appendChild(userName);
        console.log("rendering user finished:" + user.username);
        if(!user.online) {
            userCard.classList.add("offline");
        }
        if(index !== users.length - 1) {
            container.appendChild(userCard);
            container.appendChild(bottomThinLine);
        } else {
            container.appendChild(userCard);
        }
    });
};


const newDisplay = async function () {
    const directory = document.getElementById("user-directory");
    console.log("resetDirectory: ");
    resetDirectory();
    await fetchDoctorData();
    console.log("fetchDoctorData successfully: ");
    const users = window.state.users;
    console.log("users to render: " + users);
    renderUsers(users, directory);
};

const addDisplayOptionListener = function () {
    const allDisplayNode = document.getElementById("all-checkbox");
    const doctorDisplayNode = document.getElementById("doctor-checkbox");
    allDisplayNode.addEventListener("click", genDisplayNodeEventListener(allDisplayNode, doctorDisplayNode));
    allDisplayNode.addEventListener("click", newDisplay);
    doctorDisplayNode.addEventListener("click", genDisplayNodeEventListener(doctorDisplayNode, allDisplayNode));
    doctorDisplayNode.addEventListener("click", newDisplay);
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Directory;
    const directory = document.getElementById("user-directory");
    if(!window.state.users) {
        await fetchData();
    }
    addDisplayOptionListener();
    addSearchListener();
    if(window.state.users && directory) {
        directory.innerHTML = null;
        const users = window.state.users;
        renderUsers(users, directory);
    }
};

const directory = {
    fetchData,
    fetchDoctorData,
    render,
    renderUsers
};

export default directory;
