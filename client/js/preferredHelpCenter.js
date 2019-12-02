import axios from "axios";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import PreferredHelpCenters from "../view/preferredHelpCenters.html";
import Toast from "./lib/toast";
import "../style/preferredHelpCenters.less";

const setupNavBar = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const uploadMedicalId = function (e) {
    const preference = e.path[1].innerText.split("\n");
    const preferenceName = preference[0];
    if(preferenceName) {
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/uploadMedicalId/`, {
            params: {
                username: window.state.user.username,
                helpCenterName: preferenceName
            }
        }).then(async (res) => {
            if(res && res.status === 200) {
                Toast("Medical ID Uploaded!", null, null, 1000);
            } else {
                Toast("Error in Saving Preference!", "#F41C3B", null, 1000);
            }
        });
    }
};

const addMedicalIdListener = function(medicalIdItem) {
    medicalIdItem.addEventListener("click", uploadMedicalId);
};

const renderPreferredHelpCenters = async function () {
    const app = document.getElementById("app");
    app.innerHTML = PreferredHelpCenters;
    setupNavBar();
    document.getElementById("all-help-centers").innerHTML = "<div class='_blank_80height' id='blank-help-center'></div>";
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/preferredHelpCenters`, {
        params: {
            username: window.state.user.username
        }
    });
    const preferredHelpCenters = res.data.results;
    if(!preferredHelpCenters || preferredHelpCenters.length === 0){
        document.getElementById("no-help-center").style.display = "block";
    }
    preferredHelpCenters.sort(function(a, b){
        if(a.helpCenterName < b.helpCenterName) { return -1; }
        if(a.helpCenterName > b.helpCenterName) { return 1; }
        return 0;
    });
    const allPreferredHelpCenters = document.getElementById("all-help-centers");
    const beforeNode = document.getElementById("blank-help-center");
    if(allPreferredHelpCenters) {
        for(let i = 0; i < preferredHelpCenters.length; i++){
            const nearbySearchItem = document.createElement("div");
            const searchItemName = document.createElement("div");
            const searchItemAddress = document.createElement("div");
            const content = document.createElement("div");
            const medicalIdIcon = document.createElement("span");
            const bottomThinLine = document.createElement("div");
            nearbySearchItem.className = "single-search-item";
            searchItemAddress.className = "nearby-item-address";
            searchItemName.className = "entity-name";
            bottomThinLine.className = "right-thin-line";
            medicalIdIcon.className = "add-medical-id";
            medicalIdIcon.id = "add-medical-id-" + i;
            nearbySearchItem.id = "search-item-" + i;
            content.id = "search-content-" + i;
            searchItemName.innerText = preferredHelpCenters[i].helpCenterName;
            searchItemAddress.innerText = preferredHelpCenters[i].helpCenterAddress;
            content.appendChild(searchItemName);
            content.appendChild(searchItemAddress);
            nearbySearchItem.appendChild(content);
            if(preferredHelpCenters[i].medicalIdUploaded === false) {
                content.className = "preferred-help-content";
                addMedicalIdListener(medicalIdIcon);
                nearbySearchItem.appendChild(medicalIdIcon);
            }
            allPreferredHelpCenters.insertBefore(nearbySearchItem, beforeNode);
            allPreferredHelpCenters.insertBefore(bottomThinLine, beforeNode);
        }
    }
};

const preferredHelpCenters = {
    renderPreferredHelpCenters
};

export default preferredHelpCenters;