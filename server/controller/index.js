const join = require("./join");
const joinCheck = require("./joinCheck");
const users = require("./users");
const user = require("./user");
const historyMessage = require("./historyMessage");
const chats = require("./chats");
const announcement = require("./announcement");
const updateStatus = require("./updateStatus");
const search = require("./search");
const postAnnouncement = require("./postAnnouncement");
const updateinformation = require("./updateinformation");
const info = require("./info");

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
    updateinformation,
    info
};

module.exports = controller;
