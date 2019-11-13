import "../style/locationSharing.less";
import View from "../view/locationSharing.html";
// import Toast from "./lib/toast";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import axios from "axios";

const ee = require("./lib/eventEmitter");

const { setDot } = require("./lib/mapDraw");
const INIT_ZOOM = 12;
import directory from "./directory";

const turf = require("@turf/turf");

const _debounce = require("lodash/debounce");
const mapboxgl = require("mapbox-gl");
const accessToken = "pk.eyJ1IjoibXJ3YXluZTIzMyIsImEiOiJjazIyZGM0aHcwZ2VvM29xbDRtbXM2M2V2In0.vbWqAo2hZr4f42LWJ9gaew";
mapboxgl.accessToken = accessToken;

const disComp = function (a, b) {
    if(a.distance === null && b.distance !== null) {
        return 1;
    } else if(a.distance !== null && b.distance === null) {
        return -1;
    } else if(a.distance === null && b.distance === null) {
        return -1;
    } else {
        return a.distance - b.distance;
    }
};

const setBackArrow = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const removeDot = function (id) {
    try {
        window.map.removeLayer(id);
        window.map.removeSource(id);
    } catch (e) {
        console.log("Failed to remove layer or resource: " + e);
    }
};

const closeLocationWatch = async function () {
    if(window.state.locationWatchId || window.state.locationWatchId === 0) {
        navigator.geolocation.clearWatch(window.state.locationWatchId);
        removeDot(`${window.state.user.username}`);
        await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
            location: {
                latitude: window.state.user.latitude,
                longitude: window.state.user.longitude
            },
            sharingLocationOpen: false
        });
    }
};

const setSwitch = function (on) {
    if(on) {
        document.getElementById("location-sharing-switch").className = "location-sharing-switch open";
    } else {
        document.getElementById("location-sharing-switch").className = "location-sharing-switch close";
    }
};

const commonMove = function () {
    console.log("move to" + window.map.getCenter());
};

const drawOtherUsers = function () {
    const users = window.state.users;
    for(const user of users) {
        if(user.longitude && user.latitude) {
            setDot(user, [user.longitude, user.latitude]);
        }
    }
};

const updateDistance = function (centerUser, users) {
    if(centerUser.longitude) {
        const centerCoord = [centerUser.longitude, centerUser.latitude];
        const options = { units: "miles" };
        const from = turf.point(centerCoord);
        for(const user of users) {
            if(user.longitude) {
                const curCoord = [user.longitude, user.latitude];
                const to = turf.point(curCoord);
                user.distance = +turf.distance(from, to, options).toFixed(2);
            } else {
                user.distance = null;
            }
        }
        return users;
    } else {
        users.map((item) => item.distance = null);
        return users;
    }
};

const renderUserList = function (users) {
    const usersSortByDistance = JSON.parse(JSON.stringify(users));
    usersSortByDistance.sort(disComp);
    window.state.usersSortByDistance = usersSortByDistance;
    const container = document.getElementById("user-list");
    container.innerHTML = null;
    usersSortByDistance.forEach((user, index) => {
        const singleUser = directory.buildSingleUser(user,(e) => {
            window.state.isViewingMap = true;
            if(user.longitude) {
                window.map.flyTo({
                    center: [user.longitude, user.latitude]
                });
            }
        });
        singleUser.id = user.username;
        if(user.distance || user.distance === 0) {
            const distance = document.createElement("div");
            distance.className = "distance";
            distance.innerText = user.distance + " mile";
            singleUser.appendChild(distance);
        }
        const bottomThinLine = directory.buildBottomLine();
        if(index !== users.length - 1) {
            container.appendChild(singleUser);
            container.appendChild(bottomThinLine);
        } else {
            container.appendChild(singleUser);
        }
    });
};

const setUpMapEventHandle = function () {
    ee.on("CLICK_DOT", (id) => {
        window.state.isViewingMap = true;
        const userList = document.getElementById("user-list");
        const index = window.state.usersSortByDistance.findIndex((item) => item.username === id);
        userList.scrollTop = index * 80 + (index - 1);
    });
    ee.on("UPDATE_USER_LOCATION",(data) => {
        const user = window.state.userMap[data.username];
        const center = [user.longitude, user.latitude];
        if(!data.sharingLocationOpen){
            removeDot(data.username);
        } else {
            setDot(user,center);
            renderUserList(window.state.users);
        }
    });
};

const initMap = function () {
    const user = window.state.user;
    const center = user.longitude ? [user.longitude, user.latitude] : [-122.419416, 37.774929];
    const map = new mapboxgl.Map({
        container: "mapbox",
        style: "mapbox://styles/mapbox/light-v9",
        center: center, // Hint: lng and lat is reverse with Google map
        zoom: INIT_ZOOM || 12 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on("move", _debounce(commonMove, 100));
    map.on("load", () => {
        setDot(window.state.user, center);
        drawOtherUsers();
    });
    window.map = map;
};

const initLocationWatch = function () {
    const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 30 * 1000
    };
    const geoSuccess = async function (position) {
        console.log("GeoSuccess: ", position.coords.longitude, position.coords.latitude);
        window.state.user.latitude = position.coords.latitude;
        window.state.user.longitude = position.coords.longitude;
        window.state.userMap[window.state.user.username].latitude = position.coords.latitude;
        window.state.userMap[window.state.user.username].longitude = position.coords.longitude;
        await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            sharingLocationOpen: true
        });
        setSwitch(true);
        window.state.user.sharingLocationOpen = true;
        if(window.map.isStyleLoaded()) {
            if(!window.state.isViewingMap) {
                window.map.flyTo({
                    center: [window.state.user.longitude, window.state.user.latitude]
                });
            }
            setDot(window.state.user, [window.state.user.longitude, window.state.user.latitude]);
        } else {
            // MapStyle is not loaded here, so we need to set timeout to let it fly to there
            setTimeout(() => {
                if(!window.state.isViewingMap) {
                    window.map.flyTo({
                        center: [window.state.user.longitude, window.state.user.latitude]
                    });
                }
                setDot(window.state.user, [window.state.user.longitude, window.state.user.latitude]);
            }, 1000);
        }
        window.state.users = updateDistance(window.state.user, window.state.users);
        renderUserList(window.state.users);
    };
    const geoError = function (error) {
        // Toast(`Failed to get location, ${error.message}`, "#F41C3B", null, 5000);
    };
    window.state.locationWatchId = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
};

const switchLocationSharing = async function () {
    if(window.state.user.sharingLocationOpen) {
        window.state.isViewingMap = true;
        await closeLocationWatch();
        setSwitch(false);
    } else {
        window.state.isViewingMap = false;
        initLocationWatch();
        setSwitch(true);
    }
    window.state.user.sharingLocationOpen = !window.state.user.sharingLocationOpen;
};

const setLocationSharingIcon = function () {
    document.getElementById("location-sharing-switch").addEventListener("click", switchLocationSharing);
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = View;
    setBackArrow();
    window.state.isViewingMap = false;
    initMap(INIT_ZOOM); // default location, CMU-SV Campus
    initLocationWatch();
    setLocationSharingIcon();
    renderUserList(window.state.users);
    setUpMapEventHandle();
};

const locationSharing = {
    render
};

export default locationSharing;
