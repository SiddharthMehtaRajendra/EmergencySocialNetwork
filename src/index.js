import './index.less';
import Navigo from 'navigo';
import About from './view/about.html';
import ChatList from './view/chatList.html';
import Error from './view/error.html';
import Login from './view/login.html';
import Register from './view/register.html';
import initRegisterHandler from './js/register';
import initRouter from './js/initRouter';
import jumptoRegisterHandler from './js/home';

initRouter();

const app = document.getElementById('app');
const router = new Navigo(null, true, '#');

router.on('/', function () {
    app.innerHTML = About
    jumptoRegisterHandler();
}).resolve();

router.on('/register', function () {
    app.innerHTML = Register;
    initRegisterHandler();
}).resolve();

router.on('/login', function () {
    app.innerHTML = Login;
}).resolve();

router.notFound(function () {
    app.innerHTML = Error
}).resolve();
