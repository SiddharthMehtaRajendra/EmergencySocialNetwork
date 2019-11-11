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
    console.log(infos);
    await storeInformation(infos);
};

const addBackListener = function () {
    document.getElementsByClassName("cancel-button choice")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
};

const addupdateListener = function () {
    document.getElementsByClassName("update-button choice")[0].addEventListener("click", () => {
        updateInformation();
        window.location.hash = "/me";
    });
};

const informationController = async function () {
    addBackListener();
    addupdateListener();
    // await storeInformation(infos);
};

export default informationController;