import axios from "axios";
import { API_PREFIX, SERVER_ADDRESS } from "./constant/serverInfo";
import Toast from "./lib/toast";
import SearchHelpResults from "../view/searchHelpResults.html";
import "../style/searchHelpResults.less";

const storePreferenceDetails = function (e) {
    const preference = e.path[1].innerText.split("\n");
    const preferenceName = preference[0];
    const preferenceAddress = preference[1] || "101 Parkway Mountain View";
    if(preferenceName && preferenceAddress) {
        axios.post(`${SERVER_ADDRESS}${API_PREFIX}/saveHelpCenter/`, {
            params: {
                helpCenterName: preferenceName,
                helpCenterAddress: preferenceAddress,
                username: window.state.user.username
            }
        }).then(async (res) => {
            if(res && res.status === 200) {
                Toast("Preference Saved!", null, null, 1000);
            } else {
                Toast("Error in Saving Preference!", "#F41C3B", null, 1000);
            }
        });
    }
};

const addPreferredIconListener = function(preferredIcon) {
    preferredIcon.addEventListener("click", storePreferenceDetails);
};

const renderNearbySearchResults = function (nearbySearchItems, beforeNode) {
    const allNearbyPlaces = document.getElementById("all-help-centers");
    if(!beforeNode) {
        beforeNode = document.getElementById("blank-help-center");
    }
    if(allNearbyPlaces) {
        nearbySearchItems.forEach((nearbySearchNode, index) => {
            const nearbySearchItem = document.createElement("div");
            const searchItemName = document.createElement("div");
            const searchItemAddress = document.createElement("div");
            const content = document.createElement("div");
            const preferredIcon = document.createElement("div");
            const bottomThinLine = document.createElement("div");
            nearbySearchItem.className = "single-search-item";
            searchItemAddress.className = "nearby-item-address";
            searchItemName.className = "entity-name";
            bottomThinLine.className = "right-thin-line";
            content.className = "nearby-search-content";
            preferredIcon.className = "add-pref-btn";
            preferredIcon.id = "add-pref-btn-" + index;
            nearbySearchItem.id = "search-item-" + index;
            content.id = "search-content-" + index;
            addPreferredIconListener(preferredIcon);
            searchItemName.innerText = nearbySearchNode.name;
            searchItemAddress.innerText = nearbySearchNode.vicinity;
            content.appendChild(searchItemName);
            content.appendChild(searchItemAddress);
            nearbySearchItem.appendChild(content);
            nearbySearchItem.appendChild(preferredIcon);
            allNearbyPlaces.insertBefore(nearbySearchItem, beforeNode);
            allNearbyPlaces.insertBefore(bottomThinLine, beforeNode);
        });
    }
};

const getHelpSearchType = function () {
    const hospitalSearchNode = document.getElementById("hospital-checkbox");
    const policeSearchNode = document.getElementById("police-checkbox");
    const fireStationSearchNode = document.getElementById("fire-station-checkbox");
    if(hospitalSearchNode.value === "selected") {
        return "hospital";
    } else if(policeSearchNode.value === "selected") {
        return "police";
    } else if(fireStationSearchNode.value === "selected") {
        return "fire_station";
    }
    return "hospital";
};

const setupNavBar = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const renderSearchResult = function (data) {
    document.getElementById("nearby-search-block").style.display = "none";
    document.getElementById("nearby-center-label").style.display = "block";
    document.getElementById("all-help-centers").innerHTML = "<div class='_blank_80height' id='blank-help-center'></div>";
    const beforeNode = document.getElementById("blank-help-center");
    renderNearbySearchResults(data, beforeNode);
};

const genSearchNodeEventListener = function (node, otherNodeOne, otherNodeTwo) {
    return () => {
        node.style.backgroundColor = "#000";
        node.value = "selected";
        otherNodeOne.style.backgroundColor = "#fff";
        otherNodeTwo.style.backgroundColor = "#fff";
        otherNodeOne.value = "unselected";
        otherNodeTwo.value = "unselected";
    };
};

const addSearchOptionListener = function () {
    const hospitalSearchNode = document.getElementById("hospital-checkbox");
    const policeSearchNode = document.getElementById("police-checkbox");
    const fireStationSearchNode = document.getElementById("fire-station-checkbox");
    hospitalSearchNode.addEventListener("click", genSearchNodeEventListener(hospitalSearchNode, policeSearchNode, fireStationSearchNode));
    policeSearchNode.addEventListener("click", genSearchNodeEventListener(policeSearchNode, hospitalSearchNode, fireStationSearchNode));
    fireStationSearchNode.addEventListener("click", genSearchNodeEventListener(fireStationSearchNode, hospitalSearchNode, policeSearchNode));
};

const searchHelpCenterData = async function () {
    const keywords = getHelpSearchType();
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/helpSearch`, {
        params: {
            keywords: keywords
        }
    });
    renderSearchResult(res.data.results);
};

const renderSearchHelpCenters = async function() {
    const app = document.getElementById("app");
    app.innerHTML = SearchHelpResults;
    document.getElementById("search-icon-help-center").addEventListener("click", searchHelpCenterData);
    addSearchOptionListener();
    setupNavBar();
};

const searchHelpCenters = {
    renderSearchHelpCenters
};

export default searchHelpCenters;
