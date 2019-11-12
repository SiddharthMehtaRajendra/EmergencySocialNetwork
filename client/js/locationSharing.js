import "../style/locationSharing.less";
import View from "../view/locationSharing.html";
import Toast from "./lib/toast";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import axios from "axios";

const { setDot } = require("./lib/mapDraw");
import directory from "./directory";
const turf = require("@turf/turf");

const _debounce = require("lodash/debounce");
const mapboxgl = require("mapbox-gl");
const accessToken = "pk.eyJ1IjoibXJ3YXluZTIzMyIsImEiOiJjazIyZGM0aHcwZ2VvM29xbDRtbXM2M2V2In0.vbWqAo2hZr4f42LWJ9gaew";
mapboxgl.accessToken = accessToken;

const setBackArrow = function () {
    document.getElementById("navbar-back-arrow").addEventListener("click", () => {
        window.history.go(-1);
    });
};

const closeLocationWatch = function () {
    if(window.state.location.watchId) {
        navigator.geolocation.clearWatch(window.state.location.watchId);
        window.map.removeLayer(`${window.state.user.username}`);
        window.map.removeSource(`${window.state.user.username}`);
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
                user.distance =  turf.distance(from, to, options).toFixed(2) + " mile";
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
    const container = document.getElementById("user-list");
    container.innerHTML = null;
    users.forEach((user,index) => {
        const singleUser = directory.buildSingleUser(user);
        if(user.distance) {
            const distance = document.createElement("div");
            distance.className = "distance";
            distance.innerText = user.distance;
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

const initMap = function (zoom) {
    const user = window.state.user;
    const center = user.longitude ? [user.longitude, user.latitude] : [37.774929, -122.419416];
    const map = new mapboxgl.Map({
        container: "mapbox",
        style: "mapbox://styles/mapbox/light-v9",
        center: center, // Hint: lng and lat is reverse with Google map
        zoom: zoom || 12 // starting zoom
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
        window.state.location.latitude = position.coords.latitude;
        window.state.location.longitude = position.coords.longitude;
        window.state.location.accuracy = position.coords.accuracy;
        window.state.user.latitude = position.coords.latitude;
        window.state.user.longitude =  position.coords.longitude;
        window.state.userMap[window.state.user.username].latitude = position.coords.latitude;
        window.state.userMap[window.state.user.username].longitude = position.coords.longitude;
        // window.map.setCenter([window.state.location.longitude, window.state.location.latitude]);
        await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        });
        setSwitch(true);
        window.state.location.open = true;
        window.state.locationSharingPageLoading = false;
        if(window.map.isStyleLoaded()) {
            window.map.flyTo({
                center: [window.state.location.longitude, window.state.location.latitude]
            });
            setDot(window.state.user, [window.state.location.longitude, window.state.location.latitude]);
        }
        window.state.users = updateDistance(window.state.user,window.state.users);
        renderUserList(window.state.users);
    };
    const geoError = function (error) {
        Toast(`Failed to get location, ${error.message}`, "#F41C3B", null, 5000);
    };
    window.state.location.watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
};

const switchLocationSharing = function () {
    if(window.state.location.open) {
        closeLocationWatch();
        setSwitch(false);
    } else {
        initLocationWatch();
        setSwitch(true);
    }
    window.state.location.open = !window.state.location.open;
};

const setLocationIcon = function () {
    document.getElementById("location-sharing-switch").addEventListener("click", switchLocationSharing);
};

const render = async function () {
    const app = document.getElementById("app");
    app.innerHTML = View;
    setBackArrow();
    if(!window.state.location) {
        window.state.location = {};
        window.state.location.open = false;
        window.state.locationSharingPageLoading = true;
    }

    initLocationWatch();
    initMap(12); // default location, CMU-SV Campus
    setLocationIcon();
    window.state.users = updateDistance(window.state.user,window.state.users);
    renderUserList(window.state.users);
};

const locationSharing = {
    render
};

export default locationSharing;
