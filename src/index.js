import './style/index.less';
import './style/welcome.less';
import './style/directory.less';
import './style/home.less';
import './style/join.less';
import Navigo from 'navigo';
import Welcome from './view/welcome.html';
import Directory from './view/directory.html';
import Home from './view/home.html';
import Error from './view/error.html';
import Join from './view/join.html';
import initRouter from './js/initRouter';
import initJoinPage from './js/join';

initRouter();

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

router.on('/directory', function () {
    app.innerHTML = Directory;
}).resolve();

router.notFound(function () {
    app.innerHTML = Error;
}).resolve();
