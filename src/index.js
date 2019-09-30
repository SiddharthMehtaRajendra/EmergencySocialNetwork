import './style/index.less';
import './style/welcome.less';
import './style/home.less';
import './style/join.less';
import Navigo from 'navigo';
import Welcome from './view/welcome.html';
import Home from './view/home.html';
import Error from './view/error.html';
import Join from './view/join.html';
import Me from './view/_me.html';
import Directory from './view/_directory.html';
import Chats from './view/_chats.html';
import Chat from './view/chat.html';
import Announcement from './view/_announcement.html';
import initRouter from './js/initRouter';
import initJoinPage from './js/join';
import initBottomTab from './components/bottomTab';
import initChat from './js/chat';
import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.withCredentials = true;

const app = document.getElementById('app');
const router = new Navigo(null, true, '#');

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

router.on('/me', function () {
    app.innerHTML = Me;
}).resolve();

router.on('/directory', function () {
    app.innerHTML = Directory;
}).resolve();

router.on('/chats', function () {
    app.innerHTML = Chats;
}).resolve();

router.on('/announcement', function () {
    app.innerHTML = Announcement;
}).resolve();

router.on('/chat/:id', function () {
    app.innerHTML = Chat;
    initChat();
}).resolve();

router.notFound(function () {
    app.innerHTML = Error;
}).resolve();

axios.interceptors.request.use(function (config) {
    config.headers.token = Cookies.get('token');
    return config;
});

initRouter();
initBottomTab();
// TODO: Check User Login, if Login, fetch all data from server, if not, redirect to login page;
