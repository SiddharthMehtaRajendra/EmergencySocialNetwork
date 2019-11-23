import axios from "axios";
import { validateUserName, validatePassword } from "./lib/validation";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import Toast from "./lib/toast";
import BottomPopCard from "../components/bottomPopCard";
import socket from "./socket/config";
import me from "./me";
import directory from "./directory";
import "../style/join.less";
import JoinPage from "../view/join.html";

const Cookie = require("js-cookie");

const buildBottomPopCardContent = (username) => {
    const usernameDom = document.createElement("div");
    usernameDom.id = "join-page-username";
    usernameDom.innerText = username;
    return usernameDom;
};

// const buildDoctorBottomPopCardContent = () => {
//     const isDoctorDom = document.createElement("div");
//     isDoctorDom.id = "join-page-username";
//     isDoctorDom.innerText = "Do you register as a doctor?";
//     return isDoctorDom;
// };

const reset = () => {
    Cookie.remove("token");
    window.state = {};
    socket.close();
};

const setToken = (token) => {
    Cookie.set("token", token, { expires: 1 });
    window.state.token = token;
};

const register = (flag) => {
    const isDoctor = flag;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    axios.post(`${SERVER_ADDRESS}${API_PREFIX}/join`, {
        username: username,
        password: password,
        isDoctor: isDoctor
    }).then((res) => {
        if(res.status === 200 && res.data && res.data.success) {
            reset();
            setToken(res.data.token);
            socket.open();
            me.fetchData();
            directory.fetchData();
            Toast(res.data.message);
            // socket.connect();
            setTimeout(() => {
                window.location.hash = "/welcome";
            }, 1000);
        } else {
            Toast(res.data.message);
        }
    });
};

const registerAsDoctor = () => {
    const isDoctor = true;
    register(isDoctor);
};

const registerAsCitizen = () => {
    const isDoctor = false;
    register(isDoctor);
};

const doctorCheck = () => {
    BottomPopCard.init("Do you register as a doctor?", registerAsDoctor, registerAsCitizen);
};

const join = () => {
    const usernameHint = document.getElementById("username-hint");
    const passwordHint = document.getElementById("password-hint");
    const resetHint = () => {
        usernameHint.innerText = "";
        passwordHint.innerText = "";
    };
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const usernameValidation = validateUserName(username);
    const passwordValidation = validatePassword(password);
    if(usernameValidation.result && passwordValidation.result) {
        console.log( `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`);
        resetHint();
        axios({
            method: "post",
            url: `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`,
            data: {
                username: username,
                password: password
            },
            withCredentials: true
        }).then((res) => {
            if(res.status === 200 && res.data) {
                // user exists and isDoctor is set
                if(res.data.success && res.data.exists && res.data.validationPass) {
                    reset();
                    setToken(res.data.token);
                    socket.open();
                    me.fetchData();
                    window.location.hash = "/directory";
                    directory.fetchData();
                }
                // // user exists and isDoctor is not set
                // else if(res.data.success && res.data.exists && res.data.validationPass && res.data.isDoctor === null) {
                //     BottomPopCard.setContent(buildDoctorBottomPopCardContent());
                //     BottomPopCard.show();
                //     // BottomPopCard.init("Do you register as a doctor?", register(true), register(false));
                // }
                // user not exists
                else if(!res.data.success && res.data.exists === false && res.data.validationPass === null) {
                    BottomPopCard.setContent(buildBottomPopCardContent(username));
                    BottomPopCard.show();
                    // BottomPopCard.init("Are you sure to create a new user with this username?", doctorCheck);
                }
                // fail
                else if(!res.data.success && res.data.validationPass === false) {
                    Toast(res.data.message, "#F41C3B");
                }
            }
        }).catch((err) => {
            Toast(err.toString(), "#F41C3B");
        });
    } else {
        resetHint();
        if(!usernameValidation.result) {
            usernameHint.innerText = usernameValidation.text;
        }
        if(!passwordValidation.result) {
            passwordHint.innerText = passwordValidation.text;
        }
    }
};


const initJoinPage = () => {
    const app = document.getElementById("app");
    app.innerHTML = JoinPage;
    const registerBtn = document.getElementById("register-btn");
    registerBtn.addEventListener("click", join);
    BottomPopCard.init("Are you sure to create a new user with this username?", doctorCheck);
};

export default initJoinPage;
