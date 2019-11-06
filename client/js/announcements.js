import Announcement from "../view/announcements.html";
import axios from "axios";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import dateFormat from "./lib/dateFormat";
import "../style/announcements.less";

const pageSize = 100;

const addSearchListener = function () {
    document.getElementsByClassName("search-icon")[0].addEventListener("click", () => {
        window.location.hash = "/search/announcement";
    });
};

const addPostEventListener = function () {
    const postDom = document.getElementById("post-btn");
    if(postDom) {
        postDom.addEventListener("click", () => {
            window.location.hash = "/postAnnouncement";
        });
    }
};

const fetchData = async function () {
    window.state.announcements = [];
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/announcement`, {
        params: {
            smallestAnnouncementId: window.state.smallestAnnouncementId || Infinity,
            pageSize: pageSize
        }
    });
    if(res.status === 200 && res.data.success && res.data.announcements) {
        window.state.announcements = res.data.announcements;
        window.state.smallestAnnouncementId = (window.state.announcements[0] && window.state.announcements[0].announcementId) || 0;
    }
};

const renderAnnouncements = function (announcements, container, beforeNode) {
    if(!announcements) {
        announcements = window.state.announcements;
    }
    if(!beforeNode) {
        beforeNode = document.getElementById("blank-announcement");
    }
    if(container) {
        announcements.forEach((announcement, index) => {
            const announcementItem = document.createElement("div");
            const citizenName = document.createElement("div");
            const announcementTitle = document.createElement("div");
            const announcementContent = document.createElement("div");
            const announcementTime = document.createElement("div");
            const announcementInfo = document.createElement("div");
            const bottomThinLine = document.createElement("div");
            announcementItem.className = "single-announcement";
            announcementItem.id = "announcement-" + announcement.announcement_id || announcement.announcementId;
            announcementInfo.className = "announcement-info";
            citizenName.className = "name";
            bottomThinLine.className = "right-thin-line";
            announcementTitle.className = "title";
            announcementContent.className = "content";
            citizenName.innerText = announcement.from;
            announcementTitle.innerText = announcement.title || "No Title";
            announcementContent.innerText = announcement.content;
            announcementTime.innerText = dateFormat(announcement.time, "mm/dd HH:MM");
            announcementInfo.appendChild(citizenName);
            announcementInfo.appendChild(announcementTime);
            announcementItem.appendChild(announcementTitle);
            announcementItem.appendChild(announcementContent);
            announcementItem.appendChild(announcementInfo);
            container.insertBefore(announcementItem, beforeNode);
            container.insertBefore(bottomThinLine, beforeNode);
        });
    }
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = Announcement;
    const allAnnouncementsDom = document.getElementById("all-announcement");
    window.state.smallestAnnouncementId = Infinity;
    if(!window.state.announcements) {
        await fetchData();
    }
    if(window.state.announcements && allAnnouncementsDom) {
        allAnnouncementsDom.innerHTML = null;
        await renderAnnouncements(null, allAnnouncementsDom);
    }
    addSearchListener();
    addPostEventListener();
};

const announcements = {
    render,
    renderAnnouncements,
    fetchData
};

export default announcements;
