import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import "../style/profile.less";
import Profile from "../view/profile.html";
import Utils from "./lib/appUtils";

const fetchData = async function () {
    const username = window.location.href.split("/").pop();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/profile/${username}`);
    if(res.status === 200 && res.data.success && res.data.user) {
        window.state.profileuser = res.data.user;
    }
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Profile;
    document.getElementById("single-profile-navbar-title").innerText = "Directory";
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
    await fetchData();
    const user = window.state.profileuser;
    if(user.avatar.indexOf("#") === 0) {
        document.getElementById("page-me-avatar").style.backgroundColor = user.avatar;
        document.getElementById("page-me-avatar").innerText = user.username[0];
    }
    document.getElementById("page-me-username").innerText = user.username;
    document.getElementById("page-me-status").innerText = user.status;
    Utils.renderStatusColor(user.status, document.getElementById("page-me-status"));
    document.getElementById("message-menu").addEventListener("click", () => {
        window.location.hash = "/chat/" + user.username;
    });
};

const profile = {
    fetchData,
    render
};

export default profile;
