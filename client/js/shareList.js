import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/shareList.less";
import ShareList from "../view/shareList.html";
import directory from "./directory";
import checkIcon from "../resource/checkIcon.svg";

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
        if(node.getAttribute("selected") === "no") {
            node.style.backgroundColor = "#7ED321";
            node.setAttribute("selected", "yes");
        } else {
            node.style.backgroundColor = "#D8D8D8";
            node.setAttribute("selected", "no");
        }
    });

};

const buildCheckIcon = function () {
    const img = document.createElement("img");
    img.src = checkIcon;
    img.className = "check-icon";
    return img;
};

const renderUsers = function (users, container) {
    users.forEach((user, index) => {
        const userCard = directory.buildSingleUser(user, () => {
            if(window.state.shareMap[user.username]){
                delete window.state.shareMap[user.username];
                document.getElementById("u_" + user.username).classList.remove("check");
            } else {
                window.state.shareMap[user.username] = true;
                document.getElementById("u_" + user.username).classList.add("check");
            }
        });
        userCard.appendChild(buildCheckIcon());
        userCard.classList.add("un-check");
        userCard.id = "u_" + user.username;
        const bottomThinLine = directory.buildBottomLine();
        if(index !== users.length - 1) {
            container.appendChild(userCard);
            container.appendChild(bottomThinLine);
        } else {
            container.appendChild(userCard);
        }
    });
};

const addBackListener = function () {
    const backNode = document.getElementsByClassName("cancel-button choice");
    if(backNode.length > 0) {
        backNode[0].addEventListener("click", () => {
            window.history.go(-1);
        });
    }
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const getShareList = function () {
    return Object.keys(window.state.shareMap);
};

const addSubmitListener = function () {
    document.getElementsByClassName("update-button")[0].addEventListener("click", () => {
        window.state.shareList = getShareList();
        window.history.go(-1);
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = ShareList;
    addBackListener();
    const directory = document.getElementById("user-directory");
    window.state.shareMap = {};
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
