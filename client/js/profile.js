import axios from "axios";
import socket from "./socket/config";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import "../style/profile.less";
import Profile from "../view/profile.html";
import BottomPopCard from "../components/bottomPopCard/index";
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

const sendConfrimMessage = (Info) => {
    const currentUser = window.state.user;
    const toUser = window.state.profileuser;
    const content = Info;
    if(content && content.length > 0) {
        const chatId = (window.state.chatsMap[toUser] && window.state.chatsMap[toUser].chatId) || (toUser === "public" ? -1 : null);
        socket.emit("CONFIRM_MESSAGE", {
            content: content,
            type: 0,
            from: currentUser.username,
            to: toUser.username,
            status: (window.state && window.state.user && window.state.user.status) || "ok",
            chatId: chatId
        });
    }
};

// let isInUserList;

const addPrivateDoctor = (user, profileuser) => {
    const doctor = user;
    const citizen = profileuser;
    console.log("username1" + doctor);
    console.log("username2" + citizen);
    return () => {
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/addPrivateDoctor`, {
            username1: doctor,
            username2: citizen
        }).then((res) => {
            console.log(res);
        // window.state.myDoctors.push(profileuser);
        }).catch((err) => {
            console.log(err);
        });
        BottomPopCard.close();
        socket.emit("CONFIRM_ADD_DOCTOR", {
            doctor: doctor,
            citizen: citizen,
            result: true
        });
    };
};

const removePrivateDoctor = (user, profileuser) => {
    const citizen = user.username;
    const doctor = profileuser.username;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/removePrivateDoctor`, {
        username1: citizen,
        username2: doctor
    }).then((res) => {
        socket.emit("REMOVE_DOCTOR", {
            citizen: citizen,
            doctor: doctor,
            result: true
        });
        // window.state.myDoctors.pop(profileuser);
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

const renderDoctor = async function () {
    let toggle;
    const profileuser = window.state.profileuser;
    const user = window.state.user;
    const privateDoctorBtn = document.getElementById("private-doctor-menu-text");
    if(searchInFriendList(user, profileuser) === true) {
        toggle = 1;
        privateDoctorBtn.innerText = "Remove Private Doctor";
    } else {
        toggle = 0;
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
        if(privateDoctorBtn.innerText === "Remove Private Doctor") {
            // remove Private Doctor
            removePrivateDoctor(user, profileuser);
            // await fetchData();
            console.log("successfully removed");
        } else {
            // add Private Doctor
            await sendConfrimMessage("I would like to add you as my private doctor");
            // isInUserList = addPrivateDoctorHelper(user, profileuser);
            // addPrivateDoctor(user, profileuser);
            // isInUserList = 1;
            // if(searchInFriendList(user, profileuser) === true) {
            //     isInUserList = 1;
            //     console.log("successfully added");
            //     privateDoctorBtn.innerText = "Remove Private Doctor";
            // }
            // await fetchData();
        }
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Profile;
    document.getElementById("private-doctor-menu").style.display = "none";
    document.getElementById("single-profile-navbar-title").innerText = "Directory";
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        // // directory.fetchData();
        // // window.location.hash = "/directory/";
        // directory.render();
        // window.location.hash = "/directory/";
        window.history.go(-1);
        // document.location.reload(true);
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
    render,
    addPrivateDoctor
};

export default profile;
