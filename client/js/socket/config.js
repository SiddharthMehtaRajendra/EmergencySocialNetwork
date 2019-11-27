import io from "socket.io-client";
import chat from "../chat";
import processMessage from "../lib/processMessage";
import directory from "../directory";
import profile from "../profile";
import chats from "../chats";
import me from "../me";
import announcement from "../announcements";
import { SERVER_ADDRESS } from "../constant/serverInfo";
import Toast from "../lib/toast";
import BottomPopCard from "../../components/bottomPopCard/index";
const turf = require("@turf/turf");

const ee = require("../lib/eventEmitter");

const socket = io(SERVER_ADDRESS);

socket.on("UPDATE_MESSAGE", (msg) => {
    const user = window.location.href.split("/").pop();
    const currentUser = window.state.user;
    if(user === msg.from || user === msg.to) {
        chat.renderOneMessage(processMessage(msg));
    } else {
        if(msg.to === "public") {
            msg.from = "(Public Board) " + msg.from;
        }
        const newMessage = msg.from + ":\r\n" + msg.content;
        if( currentUser !== msg.from) {
            Toast(newMessage, null, null, 5000);
        }
    }
});

socket.on("UPDATE_CONFIRM_MESSAGE", (msg) => {
    const chatTo = window.location.href.split("/").pop();
    const currentUser = window.state.user;
    if(currentUser.username === msg.from || chatTo === msg.to) {
        // chat.renderOneMessage(processMessage(msg));
    } else {
        const newMessage = msg.from + ":\r\n" + msg.content;
        Toast(newMessage, null, null, 5000);
        BottomPopCard.init("Do you acknowledge this situation?", profile.addPrivateDoctor(msg.to, msg.from));
        BottomPopCard.show();
    }
});

socket.on("UPDATE_STATUS_CHANGE_MESSAGE", (msg) => {
    const chatTo = window.location.href.split("/").pop();
    const currentUser = window.state.user;
    if(msg.from === currentUser.username) {
        // chat.renderOneMessage(processMessage(msg));
    } else {
        const newMessage = msg.from + ":\r\n" + msg.content;
        Toast(newMessage, null, null, 5000);
        console.log("msg.from" + msg.from);
        console.log("msg.to" + msg.to);
        BottomPopCard.init("Do you acknowledge this situation?", me.sendStatusConfirmMessageHelper(msg.from));
        BottomPopCard.show();
    }
});

socket.on("DOCTOR_CONFIRMED", async (pair) => {
    console.log("doctor confirmed");
    const privateDoctorBtn = document.getElementById("private-doctor-menu-text");
    privateDoctorBtn.innerText = "Remove Private Doctor";
});

socket.on("DOCTOR_REMOVED", async (pair) => {
    console.log("doctor confirmed");
    const privateDoctorBtn = document.getElementById("private-doctor-menu-text");
    privateDoctorBtn.innerText = "Add Private Doctor";
});


socket.on("UPDATE_ANNOUNCEMENT", async (payload) => {
    window.state.announcements.unshift(payload);
    if(window.location.hash === "#/announcements") {
        await announcement.render();
    }
});

socket.on("AUTH_FAILED", () => {
    if(window.location.hash !== "#/") {
        // console.log("Socket Auth Failed, Redirect");
        window.location.hash = "/join";
    }
});

socket.on("UPDATE_DIRECTORY", async (payload) => {
    await directory.fetchData();
    if(window.location.hash === "#/directory") {
        await directory.render();
    } else if(window.location.hash === "#/chats") {
        await chats.render();
    }
});

socket.on("UPDATE_STATUS", async () => {
    await directory.fetchData();
    if(window.location.hash === "#/directory") {
        await directory.render();
    } else if(window.location.hash === "#/chats") {
        await chats.render();
    }
});

socket.on("UPDATE_CHAT", async (chat) => {
    if(chat.to !== "public") {
        if(!window.state.chatsMap[chat.otherUser]) {
            window.state.chats.push(chat);
            window.state.chatsMap[chat.otherUser] = chat;
        } else {
            window.state.chatsMap[chat.otherUser].latestMessage = chat.latestMessage;
        }
        chats.sortChats();
    } else {
        window.state.latestPublic = chat;
    }
    if(window.location.hash === "#/chats") {
        await chats.render();
    }
});

socket.on("UPDATE_USER_LOCATION", (data) => {
    if(window.state.user && data.username !== window.state.user.username) {
        const user = window.state.userMap[data.username];
        if(user) {
            user.latitude = data.location.latitude;
            user.longitude = data.location.longitude;
            user.sharingLocationOpen = data.sharingLocationOpen;
            const from = turf.point([window.state.user.longitude,window.state.user.latitude]);
            const curCoord = [user.longitude, user.latitude];
            const to = turf.point(curCoord);
            user.distance = +turf.distance(from, to, { units: "miles" }).toFixed(2);
        }
        ee.emit("UPDATE_USER_LOCATION", data);
    }
});

export default socket;
