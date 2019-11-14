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
    addPrivateDoctor,
    removePrivateDoctor
};

module.exports = controller;
