import './style/index.less';
import './style/welcome.less';
import './style/home.less';
import './style/join.less';
import './style/directory.less';
import './style/chats.less';
import './style/me.less';
import './style/announcement.less';
import './style/chat.less';
import Navigo from 'navigo';
import Welcome from './view/welcome.html';
import Home from './view/home.html';
import Error from './view/error.html';
import Join from './view/join.html';
import Directory from './view/directory.html';
import Chats from './view/chats.html';
import Me from './view/me.html';
import Chat from './view/chat.html';
import Announcement from './view/announcement.html';
import initRouter from './js/initRouter';
import directory from './js/directory';
import initJoinPage from './js/join';
import initBottomTab from './components/bottomTab';
import me from './js/me';
import guide from './js/guide';
import chats from './js/chats';
import chat from './js/chat';
import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
    if (!Cookies.get('token')) {
        window.location.hash = '/join';
    }
    config.headers.token = Cookies.get('token');
    return config;
});

axios.interceptors.response.use(function (response) {
    if (response.data && !response.data.success && response.data.redirect) {
        window.location.hash = '/join';
        return response;
    } else {
        return response;
    }
});

const app = document.getElementById('app');
const router = new Navigo(null, true, '#');
window.state = {};

router.on('/', function () {
    app.innerHTML = Home;
}).resolve();

router.on('/join', function () {
    app.innerHTML = Join;
    initJoinPage();
}).resolve();

router.on('/welcome', function () {
    app.innerHTML = Welcome;
}).resolve();

router.on('/directory', async function () {
    app.innerHTML = Directory;
    await directory.render();
}).resolve();

router.on('/announcement', function () {
    app.innerHTML = Announcement;
});

router.on('/guide', function () {
    app.innerHTML = Welcome;
    guide.render();
});

router.on('/chats', function () {
    app.innerHTML = Chats;
    chats.render();
}).resolve();

router.on('/me', async function () {
    app.innerHTML = Me;
    await me.render();
}).resolve();

router.on('/chat/:id', async function () {
    app.innerHTML = Chat;
    await chat.render();
}).resolve();

router.notFound(function () {
    app.innerHTML = Error;
}).resolve();

initRouter();
initBottomTab();
