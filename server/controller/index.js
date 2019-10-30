const join = require("./join");
const joinCheck = require("./joinCheck");
const users = require("./users");
const user = require("./user");
const historyMessage = require("./historyMessage");
const chats = require("./chats");
const announcement = require("./announcement");
const updateStatus = require("./updateStatus");

const api = {
    join,
    joinCheck,
    users,
    user,
    historyMessage,
    chats,
    announcement,
    updateStatus
};

module.exports = api;
