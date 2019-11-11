import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
// import "../style/chat.less";
// import Chat from "../view/chat.html";
const getInformation = function () {
    const inputs = document.getElementsByClassName("info-input");
    const infos = [];
    for(let i = 0; i < inputs.length; i++) {
        infos.push(inputs[i].value);
    };
    return infos;
};

const storeInformation = async function (infos) {
    const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateInformation`, {
        params: {
            name: infos[0],
            phoneNumber: infos[1],
            address: infos[2],
            contactNumber: infos[3],
            selfIntro: infos[4],
        }
    });
};

const updateInformation = async function () {
    const infos = getInformation();
    await storeInformation(infos);
};

const addBackListener = function () {
    const backNode = document.getElementsByClassName("cancel-button choice");
    if(backNode.length > 0) {
        backNode[0].addEventListener("click", () => {
            window.history.go(-1);
        });
    }; 
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
};

const addUpdateListener = function () {
    document.getElementsByClassName("update-button choice")[0].addEventListener("click", () => {
        updateInformation();
        window.location.hash = "/me";
    });
};

const addMessageListener = function () {
    document.getElementsByClassName("message-button")[0].addEventListener("click", () => {
        const username = window.location.hash.split("/").pop();
        window.location.hash = "/chat/" + username;
    });
};

const showInfo = function (info) {
    const infoContainers = document.getElementsByClassName("info-container");
    const infoList = [];
    infoList.push(info.name);
    infoList.push(info.phoneNumber);
    infoList.push(info.address);
    infoList.push(info.contactNumber);
    infoList.push(info.selfIntro);
    for(let i = 0; i < infoContainers.length; i++) {
        infoContainers[i].innerHTML = infoList[i];
    };
};

const getUserInfo = async function () {
    const username = window.location.hash.split("/").pop();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/info/` + username);
    if(res.data.success) {
        showInfo(res.data.info);
    };
};

const addShareListListener = function () {
    document.getElementsByClassName("select-button")[0].addEventListener("click", () => {
        window.location.hash = "/shareList";
    });
};

const update = async function () {
    addBackListener();
    addUpdateListener();
    addShareListListener();
    // await storeInformation(infos);   
};

const render = async function () {
    getUserInfo();
    // await storeInformation(infos);   
};

const view = async function () {
    addBackListener();
    addMessageListener();
    render();
};

const informationController = {
    update,
    view
};

export default informationController;