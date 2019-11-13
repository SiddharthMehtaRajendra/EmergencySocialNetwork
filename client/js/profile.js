import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import "../style/profile.less";
import Profile from "../view/profile.html";
import Utils from "./lib/appUtils";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const fetchData = async function () {
    const username = window.location.href.split("/").pop();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/${username}`);
    if(res.status === 200 && res.data.success && res.data.user) {
        window.state.profileuser = res.data.user;
    }
};

const renderCitizen = async function () {
    const profileuser = window.state.profileuser;
    const user = window.state.user;
    if(profileuser.avatar.indexOf("#") === 0) {
        document.getElementById("page-me-avatar").style.backgroundColor = profileuser.avatar;
        document.getElementById("page-me-avatar").innerText = profileuser.username[0];
    }
    document.getElementById("page-me-username").innerText = profileuser.username;
    document.getElementById("page-me-status").innerText = profileuser.status;
    Utils.renderStatusColor(profileuser.status, document.getElementById("page-me-status"));
    document.getElementById("message-menu").addEventListener("click", () => {
        window.location.hash = "/chat/" + profileuser.username;
    });
};

const renderDoctor = async function () {
    const profileuser = window.state.profileuser;
    const user = window.state.user;
    let toggle = 1; // user.members.includes(profileuser.username)
    document.getElementById("private-doctor-menu").style.display = "block";
    if(profileuser.avatar.indexOf("#") === 0) {
        document.getElementById("page-me-avatar").style.backgroundColor = profileuser.avatar;
        document.getElementById("page-me-avatar").innerText = profileuser.username[0];
    }
    document.getElementById("page-me-username").innerText = "Dr. " + profileuser.username;
    document.getElementById("page-me-status").innerText = profileuser.status;
    Utils.renderStatusColor(profileuser.status, document.getElementById("page-me-status"));
    document.getElementById("message-menu").addEventListener("click", () => {
        window.location.hash = "/chat/" + profileuser.username;
    });

    document.getElementById("private-doctor-menu").addEventListener("click", () => {
        if(toggle === 1) {
            document.getElementById("private-doctor-menu-text").innerText = "Remove Private Doctor";
            // addPrivateDoctor
            toggle = 0;
        } else {
            document.getElementById("private-doctor-menu-text").innerText = "Add Private Doctor";
            // addPrivateDoctor
            toggle = 1;
        }
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Profile;
    document.getElementById("private-doctor-menu").style.display = "none";
    document.getElementById("single-profile-navbar-title").innerText = "Directory";
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
    await fetchData();
    const profileuser = window.state.profileuser;
    const user = window.state.user;
    if(profileuser.isDoctor === true && user.isDoctor === false) {
        renderDoctor();
    } else {
        renderCitizen();
    }
};

const profile = {
    fetchData,
    render
};

export default profile;
