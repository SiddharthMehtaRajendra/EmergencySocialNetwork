import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import Cookie from "js-cookie";
import "../style/me.less";
import Me from "../view/me.html";
import StatusPopCard from "../components/statusPopCard";
import Utils from "./lib/appUtils";
import directory from "./directory";

const logout = function () {
    Cookie.remove("token");
    window.state = {};
    socket.close();
    window.location.hash = "/";
};

const fetchData = async function () {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/`);
    if(res.status === 200 && res.data.success && res.data.user) {
        window.state.user = res.data.user;
    }
};

const renderStatusPopCard = async function () {
    // eslint-disable-next-line no-use-before-define
    StatusPopCard.init(updateStatus);
    StatusPopCard.show();
};

const sendMessage = (Info) => {
    const currentUser = window.state.user;
    currentUser.associatedList.forEach((friend) => {
        const content = " I am in " + Info;
        if(content && content.length > 0) {
            const toUser = friend;
            const chatId = (window.state.chatsMap[toUser] && window.state.chatsMap[toUser].chatId) || (toUser === "public" ? -1 : null);
            socket.emit("MESSAGE", {
                content: content,
                type: 0,
                from: currentUser.username,
                to: toUser,
                status: (window.state && window.state.user && window.state.user.status) || "ok",
                chatId: chatId
            });
        }
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Me;
    if(!window.state.user) {
        await fetchData();
    }
    if(window.state.user) {
        const user = window.state.user;
        if(user.avatar.indexOf("#") === 0) {
            document.getElementById("page-me-avatar").style.backgroundColor = user.avatar;
            document.getElementById("page-me-avatar").innerText = user.username[0];
        }
        document.getElementById("page-me-username").innerText = user.username;
        document.getElementById("page-me-status").innerText = user.status;
        Utils.renderStatusColor(user.status, document.getElementById("page-me-status"));
        document.getElementById("logout-menu").addEventListener("click", logout);
        document.getElementById("user-status").addEventListener("click", renderStatusPopCard);
        document.getElementById("user-guide-entrance").addEventListener("click", () => {
            window.location.hash = "/guide";
        });
    }
};

const updateStatus = async function (event) {
    const statusElement = event.currentTarget.children;
    let userStatus;
    if(statusElement && statusElement[0].id) {
        userStatus = document.getElementById(statusElement[0].id).innerHTML;
        if(userStatus) {
            window.state.user.status = userStatus;
            axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateStatus/`, {
                username: window.state.user.username,
                status: userStatus
            }).then(async (res) => {
                if(res && res.status === 200) {
                    // socket.emit("MESSAGE", {
                    //     content: content,
                    //     type: 0,
                    //     from: window.state.user.username,
                    //     to: toUser,
                    //     status: (window.state && window.state.user && window.state.user.status) || "ok",
                    //     chatId: chatId
                    // });
                    await directory.fetchData();
                    await render();
                }
            });
        }
    }
    if(userStatus === "Emergency"){
        sendMessage("Emergency");
    } else if(userStatus === "Need Help"){
        sendMessage("Need Help");
    }
    StatusPopCard.close();
};



const me = {
    fetchData,
    render
};

export default me;
