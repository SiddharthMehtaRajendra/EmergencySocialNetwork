import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";

const getInformation = function () {
    const inputs = document.getElementsByClassName("info-input");
    const infos = [];
    for(let i = 0; i < inputs.length; i++) {
        infos.push(inputs[i].value);
    }
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
            shareList: window.state.shareList
        }
    });
};

const updateInformation = async function () {
    const infos = getInformation();
    await storeInformation(infos);
};

const clearHistory = function () {
    window.state.infoList = null;
    window.state.shareList = null;
};

const addBackListener = function () {
    const backNode = document.getElementsByClassName("cancel-button choice");
    if(backNode.length > 0) {
        backNode[0].addEventListener("click", () => {
            window.history.go(-1);
            clearHistory();
        });
    }
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
        clearHistory();
    });
};

const addUpdateListener = function () {
    document.getElementsByClassName("update-button choice")[0].addEventListener("click", () => {
        updateInformation();
        window.location.hash = "/me";
        clearHistory();
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
    }
    ;
};

const getUserInfo = async function () {
    const username = window.location.hash.split("/").pop();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/info/` + username);
    return res;
};

const storeRecord = async function () {
    window.state.infoList = getInformation();
};

const addShareListListener = function () {
    document.getElementsByClassName("select-button")[0].addEventListener("click", () => {
        storeRecord();
        window.location.hash = "/shareList";
    });
};

const recover = async function () {
    if(!window.state.infoList) {
        return;
    }
    const inputs = document.getElementsByClassName("info-input");
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = window.state.infoList[i];
    }
};

const update = async function () {
    addBackListener();
    addUpdateListener();
    addShareListListener();
    recover();
    // await storeInformation(infos);
};

const render = async function () {
    const res = await getUserInfo();
    if(res.data.success && res.data.info.shareList.indexOf(window.state.user.username) >= 0) {
        showInfo(res.data.info);
    }
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
