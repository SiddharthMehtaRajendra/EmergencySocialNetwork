import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import "../style/profile.less";
import Profile from "../view/profile.html";
import Utils from "./lib/appUtils";

const fetchData = async function () {
    // const currentusername = window.state.user;
    // const res2 = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/${currentusername}`);
    // if(res2.status === 200 && res2.data.success && res2.data.user) {
    //     window.state.user = res2.data.user;
    // }
    const profileusername = window.location.href.split("/").pop();
    const res1 = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/${profileusername}`);
    if(res1.status === 200 && res1.data.success && res1.data.user) {
        window.state.profileuser = res1.data.user;
    }
};

const renderCitizen = function () {
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

const searchInFriendList = function (user, profileuser) {
    if(user.associatedList.includes(profileuser.username)) {
        console.log("searchInFriendList: true.");
        return true;
    } else {
        console.log("searchInFriendList: false.");
        return false;
    }
};

const addPrivateDoctor = (user, profileuser) => {
    const username1 = user.username;
    const username2 = profileuser.username;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/addPrivateDoctor`, {
        username1: username1,
        username2: username2
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

const removePrivateDoctor = (user, profileuser) => {
    const username1 = user.username;
    const username2 = profileuser.username;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/removePrivateDoctor`, {
        username1: username1,
        username2: username2
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

const renderDoctor = async function () {
    const profileuser = window.state.profileuser;
    const user = window.state.user;
    const privateDoctorBtn = document.getElementById("private-doctor-menu-text");
    let isInUserList;
    if(searchInFriendList(user, profileuser) === true) {
        isInUserList = 1;
        privateDoctorBtn.innerText = "Remove Private Doctor";
    } else {
        isInUserList = 0;
        privateDoctorBtn.innerText = "Add Private Doctor";
    }
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

    document.getElementById("private-doctor-menu").addEventListener("click", async () => {
        if(isInUserList === 1) {
            // remove Private Doctor
            removePrivateDoctor(user, profileuser);
            privateDoctorBtn.innerText = "Add Private Doctor";
            isInUserList = 0;
            await fetchData();
        } else {
            // add Private Doctor
            addPrivateDoctor(user, profileuser);
            isInUserList = 1;
            privateDoctorBtn.innerText = "Remove Private Doctor";
            await fetchData();
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
