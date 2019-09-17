import './style/index.less';
import './style/welcome.less';
import './style/home.less';
import './style/register_login.less';
import Navigo from 'navigo';
import Welcome from './view/welcome.html';
import Home from './view/home.html';
import Error from './view/error.html';
import Login from './view/login.html';
import Register from './view/register.html';
import initRegisterHandler from './js/register';
import initRouter from './js/initRouter';

initRouter();

const app = document.getElementById('app');
const router = new Navigo(null, true, '#');

router.on('/', function () {
    app.innerHTML = Home;
}).resolve();

router.on('/register', function () {
    app.innerHTML = Register;
    initRegisterHandler();
}).resolve();

router.on('/login', function () {
    app.innerHTML = Login;
}).resolve();

router.on('/welcome', function () {
    app.innerHTML = Welcome;
}).resolve();

router.notFound(function () {
    app.innerHTML = Error;
}).resolve();
