import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import Cookie from "js-cookie";
import "../style/me.less";
import Me from "../view/me.html";
import StatusPopCard from "../components/statusPopCard";
import Utils from "./lib/appUtils";
import directory from "./directory";
import searchHelpCenters from "./searchHelpResults";

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

const addupdateInfoListener = function () {
    document.getElementById("updateInfo").addEventListener("click", () => {
        window.location.hash = "/information";
    });
};

const administer = function () {
    window.location.hash = "/profileList";
};

const privilegeCheck = async function (username) {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/` + username);
    const privilege = res.data.user.privilege;
    if(privilege === "administer") {
        document.getElementById("administer").addEventListener("click", administer);
    } else {
        document.getElementById("administer").style.display = "none";
    }
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Me;
    if(!window.state.user) {
        await fetchData();
    }
    addupdateInfoListener();
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
        privilegeCheck(user.username);
        document.getElementById("user-status").addEventListener("click", renderStatusPopCard);
        document.getElementById("user-guide-entrance").addEventListener("click", () => {
            window.location.hash = "/guide";
        });
        document.getElementById("pref-help-center").addEventListener("click", () => {
            window.location.hash = "/preferredHelpCenters";
        });
        document.getElementById("nearby-help-center").addEventListener("click", () => {
            window.location.hash = "/nearbyHelpCenters";
        });
    }
};

const sendStatusConfirmMessage = () => {
    const currentUser = window.state.user;
    const content = " I acknowledge.";
    const toUser = window.state.friend;
    const chatId = (window.state.chatsMap[toUser] && window.state.chatsMap[toUser].chatId) || (toUser === "public" ? -1 : null);
    return () => {
        socket.emit("MESSAGE", {
            content: content,
            type: 0,
            from: currentUser.username,
            to: toUser,
            status: (window.state && window.state.user && window.state.user.status) || "ok",
            chatId: chatId
        });
    };
};

const  sendStatusConfirmMessageHelper = (friend) => {
    window.state.friend = friend;
    return sendStatusConfirmMessage();
};


const sendConfrimStatusChangeMessage = (Info) => {
    const currentUser = window.state.user;
    const content = " I am in " + Info;
    currentUser.associatedList.forEach((friend) => {
        if(content && content.length > 0) {
            const toUser = friend;
            const chatId = (window.state.chatsMap[toUser] && window.state.chatsMap[toUser].chatId) || (toUser === "public" ? -1 : null);
            socket.emit("STATUS_CHANGE_MESSAGE", {
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
                    await directory.fetchData();
                    await render();
                }
            });
        }
    }
    if(userStatus === "Emergency"){
        sendConfrimStatusChangeMessage("Emergency");
    } else if(userStatus === "Need Help"){
        sendConfrimStatusChangeMessage("Need Help");
    }
    StatusPopCard.close();
};



const me = {
    fetchData,
    render,
    // sendStatusConfirmMessage,
    sendStatusConfirmMessageHelper
};

export default me;
