import "../style/locationSharing.less";
import View from "../view/locationSharing.html";
import Toast from "./lib/toast";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import axios from "axios";

const { setDot } = require("./lib/mapDraw");
const INIT_ZOOM = 12;
import directory from "./directory";
const turf = require("@turf/turf");

const _debounce = require("lodash/debounce");
const mapboxgl = require("mapbox-gl");
const accessToken = "pk.eyJ1IjoibXJ3YXluZTIzMyIsImEiOiJjazIyZGM0aHcwZ2VvM29xbDRtbXM2M2V2In0.vbWqAo2hZr4f42LWJ9gaew";
mapboxgl.accessToken = accessToken;

const disComp = function (a,b) {
    if(a.distance === null && b.distance !== null){
        return 1;
    } else if(a.distance !== null && b.distance === null){
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

const closeLocationWatch = async function () {
    if(window.state.locationWatchId) {
        navigator.geolocation.clearWatch(window.state.locationWatchId);
        try {
            window.map.removeLayer(`${window.state.user.username}`);
            window.map.removeSource(`${window.state.user.username}`);
            await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
                location: {
                    latitude: window.state.user.latitude,
                    longitude: window.state.user.longitude
                },
                sharingLocationOpen: false
            });
        } catch (e) {
            console.log("Failed to remove layer or resource");
            console.log(e);
        }
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

const updateDistance = function(centerUser, users){
    console.log(centerUser);
    if(centerUser.longitude) {
        const centerCoord = [centerUser.longitude, centerUser.latitude];
        const options = {units: "miles"};
        const from = turf.point(centerCoord);
        for(const user of users) {
            if(user.longitude){
                const curCoord = [user.longitude,user.latitude];
                const to = turf.point(curCoord);
                user.distance =  +turf.distance(from, to, options).toFixed(2);
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

const renderUserList = function(users){
    const usersSortByDistance = JSON.parse(JSON.stringify(users));
    usersSortByDistance.sort(disComp);
    const container = document.getElementById("user-list");
    container.innerHTML = null;
    usersSortByDistance.forEach((user,index) => {
        const singleUser = directory.buildSingleUser(user);
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

const initMap = function () {
    const user = window.state.user;
    const center = user.longitude ? [user.longitude, user.latitude] : [37.774929, -122.419416];
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
        timeout: 10 * 1000
    };
    const geoSuccess = async function (position) {
        console.log(position.coords);
        window.state.user.latitude = position.coords.latitude;
        window.state.user.longitude =  position.coords.longitude;
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
            window.map.flyTo({
                center: [window.state.user.longitude, window.state.user.latitude]
            });
            setDot(window.state.user, [window.state.user.longitude, window.state.user.latitude]);
        }
        window.state.users = updateDistance(window.state.user,window.state.users);
        renderUserList(window.state.users);
    };
    const geoError = function (error) {
        Toast(`Failed to get location, ${error.message}`, "#F41C3B", null, 5000);
    };
    window.state.locationWatchId = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
};

const switchLocationSharing = async function () {
    if(window.state.user.sharingLocationOpen) {
        await closeLocationWatch();
        setSwitch(false);
    } else {
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
    initMap(INIT_ZOOM); // default location, CMU-SV Campus
    initLocationWatch();
    setLocationSharingIcon();
    renderUserList(window.state.users);
};

const locationSharing = {
    render
};

export default locationSharing;
