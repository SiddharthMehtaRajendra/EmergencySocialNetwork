import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/shareList.less";
import ShareList from "../view/shareList.html";
import Utils from "./lib/appUtils";
import directory from "./directory";

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

const renderUsers = function (users, container) {
    users.forEach((user, index) => {
        const userCard = directory.buildSingleUser(user, () => {});
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

const getshareList = function () {
    const nodes = document.getElementsByClassName("userContainer");
    const newList = [];
    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].getElementsByClassName("selectedButton")[0].getAttribute("selected") === "yes") {
            newList.push(nodes[i].getElementsByClassName("username")[0].innerHTML);
        }
    }
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
