import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import validation from "./lib/validation";
import updateUserProfile from "../view/updateUserProfile.html";
import UserProfile from "../view/userProfile.html";
// import "../style/chat.less";
// import Chat from "../view/chat.html";

const getPrivilegeType = function () {
    const citizenNode = document.getElementById("citizen-checkbox");
    const coordinatorNode = document.getElementById("coordinator-checkbox");
    const administerNode = document.getElementById("administer-checkbox");
    if(citizenNode["value"] === "selected") {
        return "citizen";
    } else if(coordinatorNode["value"]  === "selected") {
        return "coordinator";
    } else if(administerNode["value"]  === "selected"){
        return  "administer";
    }
    return "citizen";
};

const getAccountStatus = function () {
    const activeNode = document.getElementById("active-checkbox");
    const inactiveNode = document.getElementById("inactive-checkbox");
    if(activeNode["value"] === "selected") {
        return "active";
    } else if(inactiveNode["value"] === "selected") {
        return "inactive";
    }
    return "active";
};

const getInformation = function () {
    const inputs = document.getElementsByClassName("info-input");
    const infos = {};
    const oldUsername = window.location.hash.split("/").pop();
    infos["oldUsername"] = oldUsername;
    infos["privilegeType"] = getPrivilegeType();
    infos["accountType"] = getAccountStatus();
    infos["newUsername"] = inputs[0].value;
    infos["password"] = inputs[1].value;
    return infos;
};

const storeInformation = async function (infos) { 
    const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateProfile`, {
        params: {
            oldUsername: infos.oldUsername,
            newUsername: infos.newUsername,
            password: infos.password,
            privilegeType: infos.privilegeType,
            accountType: infos.accountType
        }
    });
    return res.data.success;
};

const clearHistory = function () {
    window.state.infoList = null;
    window.state.shareList = null;
};

const updateUsername = async function (oldname, newname) {
    const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateUsername`, {
        params: {
            oldUsername: oldname,
            newUsername: newname,
        }
    });
};

const updateInformation = async function () {
    const infos = getInformation();
    const newUsername = infos.newUsername;
    const oldUsername = infos.oldUsername;
    const usernameValidation = validation.validateUserName(newUsername);
    const password = infos.password;
    const passwordValidation = validation.validatePassword(password);
    let success = true;
    if(usernameValidation.result && passwordValidation.result ) {
        updateUsername(oldUsername, newUsername);
        success = await storeInformation(infos);
        if(success) {
            if(infos["accountType"] === "inactive"){
                await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/inactive/` + infos["oldUsername"], {
                    params: {
                        newUsername: newUsername
                    }
                });
            } else {
                await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/refresh/` + infos["oldUsername"], {
                    params: {
                        newUsername: newUsername
                    }
                });
            }
            window.location.hash = "/userProfile/" + newUsername;
            clearHistory();      
            return;
        }   
    }
    const usernameHint = document.getElementById("username-hint");
    const passwordHint = document.getElementById("password-hint");
    usernameHint.innerText = "";
    passwordHint.innerText = "";
    if(!success) {
        usernameHint.innerText = "Username has been taken up!";
    } else {
        if(!usernameValidation.result) {
            usernameHint.innerText = usernameValidation.text;
        }
        if(!passwordValidation.result) {
            passwordHint.innerText = passwordValidation.text;
        }
    }
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
        window.location.hash = "/profileList";
        window.location.reload();
        clearHistory();
    });

};

const addModifyListener = function () {
    document.getElementsByClassName("message-button")[0].addEventListener("click", () => {
        const username = window.location.hash.split("/").pop();
        window.location.hash = "/updateUserProfile/" + username;
    });
};

const showInfo = function (info) {
    const infoContainers = document.getElementsByClassName("info-container");
    const infoList = [];
    infoList.push(info.username);
    infoList.push(info.privilege);
    infoList.push(info.adminStatus);
    for(let i = 0; i < infoContainers.length; i++) {
        infoContainers[i].innerHTML = infoList[i];
    };
};

const genSearchNodeEventListener = function (nodes) {
    for(let i = 0; i < nodes.length; i++){
        nodes[i].addEventListener("click", () => {
            for(let j = 0; j < nodes.length; j++) {
                if(i === j){
                    nodes[i].style.backgroundColor = "#000";
                    nodes[i]["value"] = "selected";
                }
                else {
                    nodes[j].style.backgroundColor = "#fff";
                    nodes[j]["value"] = "unselected"; 

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
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/` + username);
    return res;
};

const storeRecord = async function () {
    window.state.infoList = getInformation();
};

const addUpdateListener = function () {
    document.getElementsByClassName("update-button choice")[0].addEventListener("click", () => {
        updateInformation();
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
    const app = document.getElementById("app");
    app.innerHTML = updateUserProfile;
    addBackListener();
    addUpdateListener();
    addStatusOptionListener();
    addPrivelegeOptionListener();
    recover();
    // await storeInformation(infos);
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = UserProfile;
    const res = await getUserInfo();
    const info = res.data.user;
    showInfo(info);

};

const view = async function () {
    render();
    addBackListener();
    addModifyListener(); 
};

const profileController = {
    update,
    view
};

export default profileController;