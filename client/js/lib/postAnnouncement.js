import PostAnnouncement from "../../view/postAnnouncement.html";
import "../../style/postAnnouncement.less";
import socket from "../socket/config";

function addArrowBackListener() {
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
}

function sendAnnouncement() {
    const title = document.getElementById("post-announcement-title").value;
    const content = document.getElementById("post-announcement-content").value;
    if(title && content) {
        socket.emit("ANNOUNCEMENT", {
            title: title,
            content: content,
            type: 0,
            from: window.state.user.username,
            status: (window.state && window.state.user && window.state.user.status) || "ok"
        });
        document.getElementById("post-announcement-title").value = "";
        document.getElementById("post-announcement-content").value = "";
    }
    window.location.hash = "#/announcement";
}

function addSendAnnouncementListener() {
    document.getElementById("send-announcement-btn").addEventListener("click", () => {
        sendAnnouncement();
    });
}

async function render() {
    const app = document.getElementById("app");
    app.innerHTML = PostAnnouncement;
    window.state.content = null;
    addArrowBackListener();
    addSendAnnouncementListener();
}

const post = {
    render
};

export default post;