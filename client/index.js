import "./style/index.less";
import "./style/welcome.less";
import "./style/home.less";
import "./style/announcement.less";
import "./style/searchMessage.less";
import "./style/searchUser.less";

import Navigo from "navigo";
import Welcome from "./view/welcome.html";
import Home from "./view/home.html";
import Error from "./view/error.html";
import Announcement from "./view/announcement.html";

import guide from "./js/guide";
import chats from "./js/chats";
import chat from "./js/chat";
import announcements from "./js/announcement";
import me from "./js/me";
import directory from "./js/directory";
import search from "./js/lib/searchMessage";
import searchUser from "./js/lib/searchUser";
import searchAnnouncement from "./js/lib/searchAnnouncement";
import postAnnouncement from "./js/lib/postAnnouncement";

import initRouter from "./js/initRouter";
import initJoinPage from "./js/join";
import BottomTab from "./components/bottomTab";

import axios from "axios";
import Cookie from "js-cookie";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    if(!Cookie.get("token") && window.location.hash !== "#/") {
        console.log("Request Auth Failed, Redirect");
        window.location.hash = "/join";
    }
    config.headers.token = Cookie.get("token");
    return config;
});

axios.interceptors.response.use((response) => {
    if(response.data && !response.data.success && response.data.redirect && window.location.hash !== "#/") {
        console.log("Response Auth Failed, Redirect");
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
                console.log("Load My info");
                await me.fetchData();
            }
            if(!(window.state && window.state.users)) {
                console.log("Load Directory");
                await directory.fetchData();
            }
            if(!(window.state && window.state.chats)) {
                console.log("Load Chats");
                await chats.fetchData();
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

router.on("/announcement", async () => {
    app.innerHTML = Announcement;
    await announcements.render();
});

router.on("/guide", () => {
    app.innerHTML = Welcome;
    guide.render();
});

router.on("/chats", async () => {
    console.log("Re render");
    await chats.render();
}).resolve();

router.on("/me", async () => {
    await me.render();
}).resolve();

router.on("/chat/:id", async () => {
    console.log(window.location.hash);
    await chat.render();
}).resolve();

// router.on("/search/:contextual", async (req) => {
//     const searchParamter = req.params.contextual;
//     switch (searchParamter) {
//     case "message":
//         console.log(window.location.hash);
//         await search.render();
//         break;
//     case "user":
//         console.log(window.location.hash);
//         await searchUser.render();
//         break;
//     default:
//         console.log(window.location.hash);
//         await search.render();
//         break;
//     }
// }).resolve();

router.on("/search/user", async () => {
    console.log(window.location.hash);
    await searchUser.render();
}).resolve();


router.on("/search/:contextual", async () => {
    console.log(window.location.hash);
    await search.render();
}).resolve();

router.on("/searchAnnouncement", async () => {
    await searchAnnouncement.render();
}).resolve();

router.on("/postAnnouncement", async () => {
    await postAnnouncement.render();
}).resolve();

router.notFound(() => {
    app.innerHTML = Error;
}).resolve();
