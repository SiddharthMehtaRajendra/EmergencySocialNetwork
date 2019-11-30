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

const getPrivilegeType = function () {
    const citizenNode = document.getElementById("citizen-checkbox");
    const coordinatorNode = document.getElementById("coordinator-checkbox");
    const administerNode = document.getElementById("administer-checkbox");
    if(citizenNode.value === "selected") {
        return "citizen";
    } else if(coordinatorNode.value === "selected") {
        return "coordinator";
    } else if(administerNode.value === "selected"){
        return  "administer";
    }
    return null;
};

const getAccountStatus = function () {
    const activeNode = document.getElementById("active-checkbox");
    const inactiveNode = document.getElementById("inactive-checkbox");
    if(activeNode.value === "selected") {
        return "active";
    } else if(inactiveNode.value === "selected") {
        return "inactive";
    }
    return null;
};

const storeInformation = async function (infos) {
    const privilegeType = getPrivilegeType();
    const accountType = getAccountStatus();
    const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateProfile`, {
        params: {
            username: infos[0],
            password: infos[1],
            getPrivilegeType: privilegeType,
            contactNumber: accountType
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
    };
  
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
        clearHistory();
    });

};

const addMessageListener = function () {
    document.getElementsByClassName("message-button")[0].addEventListener("click", () => {
        const username = window.location.hash.split("/").pop();
        window.location.hash = "/updateUserProfile";
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

const genSearchNodeEventListener = function (nodes) {
    console.log(nodes);
    for(let i = 0; i < nodes.length; i++){
        nodes[i].addEventListener("click", () => {
            for(let j = 0; j < nodes.length; j++) {
                if(i === j){
                    nodes[i].style.backgroundColor = "#000";
                    nodes[i].value = "selected";
                }
                else {
                    nodes[j].style.backgroundColor = "#fff";
                    nodes[j].value = "unselected"; 
                }
            }
        });
    }
};

const addPrivelegeOptionListener = function () {
    const citizenNode = document.getElementById("citizen-checkbox");
    const coordinatorNode = document.getElementById("coordinator-checkbox");
    const administerNode = document.getElementById("administer-checkbox");
    const nodes = [citizenNode, coordinatorNode, administerNode];
    genSearchNodeEventListener(nodes);
};

const addStatusOptionListener = function () {
    const activeNode = document.getElementById("active-checkbox");
    const inactiveNode = document.getElementById("inactive-checkbox");
    const nodes = [activeNode, inactiveNode];
    genSearchNodeEventListener(nodes);
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

const addUpdateListener = function () {
    document.getElementsByClassName("update-button choice")[0].addEventListener("click", () => {
        updateInformation();
        window.history.go(-1);
        clearHistory();
    });
};

const recover = async function () {
    if(!window.state.infoList){
        return;
    };
    const inputs = document.getElementsByClassName("info-input");
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = window.state.infoList[i];
    };
};

const update = async function () {
    addBackListener();
    addUpdateListener();
    addStatusOptionListener();
    addPrivelegeOptionListener();
    recover();
    // await storeInformation(infos);
};

const render = async function () {
    const res = await getUserInfo();
    console.log(window.state.user.username);
    if(res.data.success && res.data.info.shareList.indexOf(window.state.user.username) >= 0) {
        showInfo(res.data.info);
    };
};

const view = async function () {
    addBackListener();
    addMessageListener();
    render();
};

const profileController = {
    update,
    view
};

export default profileController;