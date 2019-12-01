import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/profileList.less";
import ProfileList from "../view/profileList.html";
import me from "./me";
import Utils from "./lib/appUtils";

const fetchData = async function () {
    let friendNameList;
    await me.fetchData();
    if(!!window.state.user.associatedList) {
        friendNameList = window.state.user.associatedList;
    } else {
        friendNameList = [];
    }
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`);
    if(res.status === 200 && res.data.success && res.data.users) {
        const users = res.data.users;
        window.state.users = users;
        const userMap = {};
        const userArray = [];
        const userDoctorMap = {};
        const userDoctorArray = [];
        const userMyDoctorMap = {};
        const userMyDoctorArray = [];
        for(let i = 0; i < users.length; i++) {
            userMap[users[i].username] = users[i];
            userArray.push(users[i]);
        }
        for(let i = 0; i < users.length; i++) {
            if(users[i].isDoctor) {
                userDoctorMap[users[i].username] = users[i];
                userDoctorArray.push(users[i]);
            }
        }
        for(let i = 0; i < friendNameList.length; i++) {
            const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/${friendNameList[friendNameList.length - i - 1]}`);
            const friend = res.data.user;
            userMyDoctorArray.push(friend);
        }
        window.state.doctors = userDoctorArray;
        window.state.myDoctors = userMyDoctorArray;
        window.state.userMap = userMap;
        window.state.userDoctorMap = userDoctorMap;
    }
};

const resetDirectory = function () {
    // document.getElementById("directory-list").innerHTML = "<div class='content' id='user-directory'></div>";
    document.getElementById("directory-list").innerHTML = "<div id='user-directory'></div>";
};

const buildSingleUser = function (user) {
    const userCard = document.createElement("div");
    const userName = document.createElement("div");
    const userAvatar = document.createElement("div");
    const userStatus = document.createElement("div");
    userCard.className = "single-user common-list-item";
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
    userCard.addEventListener("click", () => {
        window.location.hash = "/userProfile/" + user.username;
    });
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
        const userCard = buildSingleUser(user);
        const bottomThinLine = buildBottomLine();
        if(index !== users.length - 1) {
            container.appendChild(userCard);
            container.appendChild(bottomThinLine);
        } else {
            container.appendChild(userCard);
        }
    });
};

const gobackListener = () => {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.location.hash = "/me";
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = ProfileList;
    const directory = document.getElementById("user-directory");
    gobackListener();
    if(!window.state.users) {
        await fetchData();
    }
    if(window.state.users && directory) {
        directory.innerHTML = null;
        const users = window.state.users;
        renderUsers(users, directory);
    }
};

const profileList = {
    fetchData,
    render,
    renderUsers,
    buildSingleUser,
    buildBottomLine
};

export default profileList;
