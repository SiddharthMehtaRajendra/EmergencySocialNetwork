import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/shareList.less";
import ShareList from "../view/shareList.html";
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

const addButtonListener = function (node) {
    node.addEventListener("click", () => {
        if(node.getAttribute("selected") === "no"){
            node.style.backgroundColor = "#7ED321";
            node.setAttribute("selected", "yes");
        } else {
            node.style.backgroundColor = "#D8D8D8";
            node.setAttribute("selected", "no");
        };
    });

};

const renderUsers = function (users, container) {
    users.forEach((user, index) => {
        const userContainer = document.createElement("div");
        const userCard = document.createElement("div");
        const userName = document.createElement("div");
        const userAvatar = document.createElement("div");
        const userStatus = document.createElement("div");
        const selectedButton = document.createElement("div");
        const bottomThinLine = document.createElement("div");
        userContainer.appendChild(userCard);
        userContainer.appendChild(selectedButton);
        userCard.className = "single-user common-list-item";
        userCard.addEventListener("click", () => {
            // window.location.hash = "/chat/" + user.username;
            window.location.hash = "/infopage/" + user.username;
        });
        userContainer.className = "userContainer";
        userName.className = "username";
        userAvatar.className = "avatar";
        userStatus.className = "status-circle";
        selectedButton.className = "selectedButton";
        selectedButton.setAttribute("selected", "no");
        bottomThinLine.className = "right-thin-line";
        userName.innerText = user.username;
        userAvatar.innerText = user.username.charAt(0);
        userAvatar.setAttribute("style", `background-color: ${user.avatar || "#CCC"};`);
        Utils.renderStatusColor(user.status, userStatus);
        userCard.appendChild(userAvatar);
        userCard.appendChild(userStatus);
        userCard.appendChild(userName);
        container.appendChild(userContainer);
        if(!user.online) {
            userCard.classList.add("offline");
        }
        if(index !== users.length - 1) {
            container.appendChild(bottomThinLine);
        };
        addButtonListener(selectedButton);
    });
};

const addBackListener = function () {
    const backNode = document.getElementsByClassName("cancel-button choice");
    if(backNode.length > 0) {
        backNode[0].addEventListener("click", () => {
            window.history.go(-1);
        });
    };
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
};

const getshareList = function () {
    const nodes = document.getElementsByClassName("userContainer");
    const newList = [];
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].getElementsByClassName("selectedButton")[0].getAttribute("selected") === "yes"){
            newList.push(nodes[i].getElementsByClassName("username")[0].innerHTML);
        };
    };
    return newList;
};

const addSubmitListener = function () {
    document.getElementsByClassName("update-button")[0].addEventListener("click", () => {
        window.state.shareList = getshareList();
        window.history.go(-1);
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = ShareList;
    addBackListener();
    const directory = document.getElementById("user-directory");
    if(!window.state.users) {
        await fetchData();
    }
    if(window.state.users && directory) {
        directory.innerHTML = null;
        const users = window.state.users;
        renderUsers(users, directory);
    }
    addSubmitListener();
};

const shareList = {
    render
};

export default shareList;
