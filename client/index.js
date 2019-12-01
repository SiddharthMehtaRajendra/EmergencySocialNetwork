import "./style/index.less";
import "./style/welcome.less";
import "./style/home.less";
import "./style/information.less";
import "./style/infopage.less";
import "./style/updateUserProfile.less";

import Navigo from "navigo";
import Welcome from "./view/welcome.html";
import Home from "./view/home.html";
import Error from "./view/error.html";
import Information from "./view/information.html";
import InfoPage from "./view/infopage.html";
import UserProfile from "./view/userProfile.html";

import guide from "./js/guide";
import chats from "./js/chats";
import chat from "./js/chat";
import announcements from "./js/announcements";
import me from "./js/me";
import directory from "./js/directory";
import search from "./js/search";
import shareList from "./js/shareList";
import profile from "./js/profile";
import postAnnouncement from "./js/postAnnouncement";
import profileList from "./js/profileList";
import informationController from "./js/information";
import locationSharing from "./js/locationSharing";
import initRouter from "./js/initRouter";
import initJoinPage from "./js/join";
import profileController from "./js/userProfile";
import BottomTab from "./components/bottomTab";
import preferredHelpCenters from "./js/preferredHelpCenter";

import axios from "axios";
import Cookie from "js-cookie";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    if(!Cookie.get("token") && window.location.hash !== "#/") {
        window.location.hash = "/join";
    }
    config.headers.token = Cookie.get("token");
    return config;
});

axios.interceptors.response.use((response) => {
    if(response.data && !response.data.success && response.data.redirect && window.location.hash !== "#/") {
        window.location.hash = "/join";
        return response;
    } else {
        return response;
    }
});

const app = document.getElementById("app");
const router = new Navigo(null, true, "#");
window.state = {};
initRouter();
BottomTab.initBottomTab();

router.hooks({
    before: async function (done, params) {
        if(!(window.location.hash === "#/" || window.location.hash === "#/join")) {
            if(!(window.state && window.state.user) && Cookie.get("token")) {
                await me.fetchData();
            }
            if(!(window.state && window.state.users)) {
                await directory.fetchData();
            }
            if(!(window.state && window.state.chats)) {
                await chats.fetchData();
            }
            if(!(window.state && window.state.announcements)) {
                await announcements.fetchData();
            }
        }
        done();
    }
});

router.on("/", () => {
    app.innerHTML = Home;
}).resolve();

router.on("/join", () => {
    initJoinPage();
}).resolve();

router.on("/welcome", () => {
    app.innerHTML = Welcome;
}).resolve();

router.on("/directory", async () => {
    await directory.render();
}).resolve();

router.on("/profileList", async () => {
    await profileList.render();
    // await profileList.render();
}).resolve();

router.on("/announcements", async () => {
    await announcements.render();
}).resolve();

router.on("/guide", () => {
    app.innerHTML = Welcome;
    guide.render();
}).resolve();

router.on("/chats", async () => {
    await chats.render();
}).resolve();

router.on("/me", async () => {
    await me.render();
}).resolve();

router.on("/chat/:id", async () => {
    await chat.render();
}).resolve();

router.on("/search/:context", async () => {
    await search.render();
}).resolve();

router.on("/postAnnouncement", async () => {
    await postAnnouncement.render();
}).resolve();

router.on("/preferredHelpCenters", async () => {
    await preferredHelpCenters.renderPreferredHelpCenters();
}).resolve();

router.on("/profile/:username", async () => {
    await profile.render();
}).resolve();

router.on("/userProfile/:username", async () => {
    await profileController.view();
}).resolve();

router.on("/information", async () => {
    app.innerHTML = Information;
    await informationController.update();
}).resolve();

router.on("/updateUserProfile/:username", async () => {
    await profileController.update();
}).resolve();

router.on("/infopage/:id", async () => {
    app.innerHTML = InfoPage;
    await informationController.view();
}).resolve();

router.on("/shareList", async () => {
    await shareList.render();
}).resolve();

router.on("/locationSharing", async () => {
    await locationSharing.render();
}).resolve();

router.notFound(() => {
    app.innerHTML = Error;
}).resolve();
