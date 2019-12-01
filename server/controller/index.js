const join = require("./join");
const joinCheck = require("./joinCheck");
const users = require("./users");
const user = require("./user");
const historyMessage = require("./historyMessage");
const chats = require("./chats");
const announcement = require("./announcement");
const updateStatus = require("./updateStatus");
const search = require("./search");
const addPrivateDoctor = require("./addPrivateDoctor");
const removePrivateDoctor = require("./removePrivateDoctor");

const postAnnouncement = require("./postAnnouncement");
const helpSearch = require("./helpSearch");
const saveHelpCenter = require("./saveHelpCenter");
const uploadMedicalId = require("./uploadMedicalId");
const preferredHelpCenters = require("./preferredHelpCenters");
const updateinformation = require("./updateinformation");
const updateProfile = require("./updateProfile");
const info = require("./info");
const updateLocation = require("./updateLocation");

const controller = {
    join,
    joinCheck,
    users,
    user,
    historyMessage,
    chats,
    announcement,
    updateStatus,
    search,
    postAnnouncement,
    helpSearch,
    saveHelpCenter,
    uploadMedicalId,
    preferredHelpCenters,
    addPrivateDoctor,
    removePrivateDoctor,
    updateinformation,
    updateProfile,
    info,
    updateLocation
};

module.exports = controller;
