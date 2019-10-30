import PostAnnouncement from "../view/postAnnouncement.html";
import "../style/postAnnouncement.less";
import axios from "axios";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import Toast from "./lib/toast";

const setupNavBar = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const postAnnouncement = function () {
    const title = document.getElementById("post-announcement-title").value;
    const content = document.getElementById("post-announcement-content").value;
    if(title && content) {
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/postAnnouncement/`, {
            announcement: {
                title: title,
                content: content,
                status: window.state.user.status,
                from: window.state.user.username
            }
        }).then(async (res) => {
            if(res && res.status === 200) {
                Toast("Post Success", null, null, 1000);
                document.getElementById("post-announcement-title").value = "";
                document.getElementById("post-announcement-content").value = "";
                window.location.hash = "/announcements";
            } else {
                Toast("Post Failed", "#F41C3B", null, 1000);
            }
        });
    }
};

const addPostAnnouncementListener = function () {
    document.getElementById("send-announcement-btn").addEventListener("click", () => {
        postAnnouncement();
    });
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = PostAnnouncement;
    setupNavBar();
    addPostAnnouncementListener();
};

const post = {
    render
};

export default post;
