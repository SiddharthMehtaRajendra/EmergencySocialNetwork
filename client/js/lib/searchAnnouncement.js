import SearchAnnouncement from "../../view/searchAnnouncement.html";
import "../../style/searchAnnouncement.less";
import dateFormat from "./dateFormat";
import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "../constant/serverInfo";
import processMessage from "./processMessage";
// import renderMessages from '../../js/chat';
const maxAnnouncementNum = 9999;

function addArrowBackListener() {
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
}


function renderAnnouncements(announcements) {
    const allAnnouncements = document.getElementById("all-announcement");
    if(announcements) {
        allAnnouncements.innerHTML = "";
        announcements.forEach((announcement, index) => {
            const announcementItem = document.createElement("div");
            const citizenName = document.createElement("div");
            const announcementContent = document.createElement("div");
            const announcementTime = document.createElement("div");
            const announcementInfo = document.createElement("div");
            const bottomThinLine = document.createElement("div");
            announcementItem.className = "single-announcement";
            announcementItem.id = "announcement-" + announcement.from;
            announcementInfo.className = "announcement-info";
            citizenName.className = "name";
            bottomThinLine.className = "right-thin-line";
            announcementContent.className = "content";
            announcementTime.className = "latest-message-time";
            citizenName.innerText = announcement.from;
            announcementContent.innerText = announcement.content;
            announcementTime.innerText = dateFormat(announcement.time, "mm/dd HH:MM");
            announcementInfo.appendChild(citizenName);
            announcementInfo.appendChild(announcementTime);
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
    window.state.smallestAnnouncementId = (announcements[announcements.length - 1] && announcements[announcements.length - 1].announcement_id) || 0;
}

function getContextual() {
    return "announcement";
}

function showResult(res) {
    renderAnnouncements(res.data.announcements);
}

async function getSearchResult() {
    const newContent = document.getElementById("search-announcement").value;
    if(newContent) {
        window.state.content = newContent;
    }
    const contextual = getContextual();
    const content = window.state.content;
    const pageSize = 2;
    if(content && content.length > 0 && contextual) {
        const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/search/` + contextual, {
            searchAnnouncement: content,
            smallestAnnouncementId: window.state.smallestAnnouncementId,
            pageSize: pageSize
        });
        if(res.data.end) {
            const node = document.getElementById("show-more");
            node.innerText = "end";
            node.style.color = "#111";
        } else {
            const node = document.getElementById("show-more");
            node.innerText = "view more";
            node.style.color = "#1983FF";
        }
        if(res) {
            showResult(res);
        }
        document.getElementById("search-announcement").value = "";
    }
}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function addSearchIconListener() {
    document.getElementsByClassName("announcement-search-icon")[0].addEventListener("click", () => {
        removeElementsByClass("single-bubble");
        window.state.smallestAnnouncementId = maxAnnouncementNum;
        getSearchResult();
    });
}

function addViewMoreListener() {
    document.getElementsByClassName("show-more")[0].addEventListener("click", () => {
        getSearchResult();
    });
}

async function render() {
    const app = document.getElementById("app");
    app.innerHTML = SearchAnnouncement;
    window.state.content = null;
    addArrowBackListener();
    addSearchIconListener();
    addViewMoreListener();
}

const search = {
    render
};

export default search;
