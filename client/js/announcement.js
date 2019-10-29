import Announcement from "../view/announcement.html";
import axios from "axios";
import socket from "./socket/config";
import lodash from "lodash";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import dateFormat from "./lib/dateFormat";

const pageSize = 20;

function sortAnnouncements() {
    function compare(announcementA, announcementB) {
        return (new Date(announcementA.time)) - (new Date(announcementB.time));
    }
    window.state.announcements.sort(compare);
}

function addSearchBoxListener() {
    document.getElementsByClassName("search-icon")[0].addEventListener("click", () => {
        window.location.hash = "/searchAnnouncement";
    });
}

async function fetchData() {
    window.state.isLoading = true;
    window.state.announcements = [];
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/announcement`, {
        params: {
            smallestAnnouncementId: window.state.smallestAnnouncementId,
            pageSize: pageSize
        }
    });
    window.state.isLoading = false;
    if(res.status === 200 && res.data.success && res.data.announcements) {
        window.state.announcements = res.data.announcements;
        window.state.smallestAnnouncementId = (window.state.announcements[0] && window.state.announcements[0].announcement_id) || 0;
    }
}

async function renderAnnouncements(announcements) {
    const allAnnouncements = announcements ? announcements : document.getElementById("all-announcement");
    if(allAnnouncements) {
        const announcements = window.state.announcements;
        announcements.forEach((announcement, index) => {
            const announcementItem = document.createElement("div");
            const citizenName = document.createElement("div");
            const announcementTitle = document.createElement("div");
            const announcementContent = document.createElement("div");
            const announcementTime = document.createElement("div");
            const announcementInfo = document.createElement("div");
            const bottomThinLine = document.createElement("div");
            announcementItem.className = "single-announcement";
            announcementItem.id = "announcement-" + announcement.from;
            announcementInfo.className = "announcement-info";
            citizenName.className = "name";
            bottomThinLine.className = "right-thin-line";
            announcementTitle.className = "title";
            announcementContent.className = "content";
            citizenName.innerText = announcement.from;
            announcementTitle.innerText = announcement.title;
            announcementContent.innerText = announcement.content;
            announcementTime.innerText = dateFormat(announcement.time, "mm/dd HH:MM");
            announcementInfo.appendChild(citizenName);
            announcementInfo.appendChild(announcementTime);
            announcementItem.appendChild(announcementTitle);
            announcementItem.appendChild(announcementContent);
            announcementItem.appendChild(announcementInfo);
            if(index !== announcements.length - 1) {
                allAnnouncements.appendChild(announcementItem);
                allAnnouncements.appendChild(bottomThinLine);
            } else {
                allAnnouncements.appendChild(announcementItem);
            }
        });
    }
}

function loadPostAnnouncement(){
    window.location.hash = "/postAnnouncement";
}

function setAnnouncementTipVisible(visible) {
    document.getElementById("new-announcement-tip").style.visibility = (visible ? "visible" : "hidden");
}

function handleScroll() {
    return lodash.debounce(async () => {
        const container = document.getElementById("all-announcement");
        const scrollTop = container.scrollTop;
        
        if(container.scrollTop + container.clientHeight >= container.scrollHeight) {
            window.state.announcementIsBottom = true;
            window.state.showAnnouncementTip = false;
            setAnnouncementTipVisible(false);
        } else {
            window.state.announcementIsBottom = false;
        }
        if(scrollTop === 0 && !window.state.isLoading) {
            await fetchData();
            await renderAnnouncements();
        }
    }, 100);
}

function scrollToBottom() {
    const container = document.getElementById("all-announcement");
    container.scrollTop = container.scrollHeight;
}

async function renderOneAnnouncement(announcement) {
    const allAnnouncements = document.getElementById("all-announcement");
    const announcementItem = document.createElement("div");
    const citizenName = document.createElement("div");
    const announcementTitle = document.createElement("div");
    const announcementContent = document.createElement("div");
    const announcementTime = document.createElement("div");
    const announcementInfo = document.createElement("div");
    const bottomThinLine = document.createElement("div");
    announcementItem.className = "single-announcement";
    announcementItem.id = "announcement-" + announcement.from;
    announcementInfo.className = "announcement-info";
    citizenName.className = "name";
    bottomThinLine.className = "right-thin-line";
    announcementTitle.className = "title";
    announcementContent.className = "content";
    citizenName.innerText = announcement.from;
    announcementTitle.innerText = announcement.title;
    announcementContent.innerText = announcement.content;
    announcementTime.innerText = dateFormat(announcement.time, "mm/dd HH:MM");
    announcementInfo.appendChild(citizenName);
    announcementInfo.appendChild(announcementTime);
    announcementItem.appendChild(announcementTitle);
    announcementItem.appendChild(announcementContent);
    announcementItem.appendChild(announcementInfo);
    allAnnouncements.appendChild(announcementItem);

    if(announcement.from === window.state.user.username && !window.state.announcementIsBottom) {
        scrollToBottom();
    }

    if(window.state.announcementIsBottom) {
        scrollToBottom();
    }

    if(!window.state.announcementIsBottom) {
        window.state.showAnnouncementTip = true;
    }
    if(window.state.showAnnouncementTip) {
        setAnnouncementTipVisible(true);
    } else {
        setAnnouncementTipVisible(false);
    }
}

async function render() {
    const app = document.getElementById("app");
    app.innerHTML = Announcement;
    const allAnnouncements = document.getElementById("all-announcement");
    window.state.smallestAnnouncementId = Infinity;
    if(!window.state.announcements) {
        await fetchData();
    }
    addSearchBoxListener();
    document.getElementById("post-btn").addEventListener("click", loadPostAnnouncement);
    document.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            sendAnnouncement();
        }
    });
    if(window.state.announcements && allAnnouncements) {
        allAnnouncements.innerHTML = "";
        await renderAnnouncements(allAnnouncements);
    }
    document.getElementById("all-announcement").addEventListener("scroll", handleScroll());
    document.getElementById("new-announcement-tip").addEventListener("click", scrollToBottom);
    scrollToBottom();
}

const announcements = {
    render,
    fetchData,
    sortAnnouncements,
    renderOneAnnouncement
};

export default announcements;
