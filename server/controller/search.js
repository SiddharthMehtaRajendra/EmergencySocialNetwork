const stopWords = require("../../client/js/constant/stopwords");
const Message = require("../../model/Message");
const User = require("../../model/User");
const Announcement = require("../../model/Announcement");

const deleteStopWords = function (str) {
    const words = str.split(" ");
    const newWords = [];
    for(let i = 0; i < words.length; i++) {
        if(!stopWords.has(words[i].toLowerCase())) {
            newWords.push(words[i]);
        }
    }
    return newWords.join(" ");
};

const searchMessage = async function (query) {
    const keywords = deleteStopWords(query.keywords);
    let result = {
        success: false,
        messages: []
    };
    if(!keywords || keywords === "") {
        return result;
    }
    result = await Message.searchMessage({
        type: query.type || null,
        keywords: keywords,
        username: query.username,
        smallestMessageId: +query.smallestMessageId,
        pageSize: +query.pageSize || 10
    });
    const messages = JSON.parse(JSON.stringify(result.res));
    const isEnd = messages.length <= query.pageSize;
    if(!isEnd && messages.length > 0) {
        messages.pop();
    }
    return {
        messages,
        isEnd,
        success: result.success
    };
};

const searchUser = async function (query) {
    const result = await User.searchUser(query.keywords);
    const users = result.res.map((item) => ({
        username: item.username,
        avatar: item.avatar,
        status: item.status,
        online: item.online
    }));
    return {
        users: users,
        success: result.success
    };
};

const searchAnnouncement = async function (query) {
    const keywords = deleteStopWords(query.keywords);
    let result = {
        success: false,
        messages: []
    };
    if(!keywords || keywords === "") {
        return result;
    }
    result = await Announcement.searchAnnouncement({
        keywords: keywords,
        smallestMessageId: +query.smallestMessageId,
        pageSize: +query.pageSize || 10
    });
    const announcements = JSON.parse(JSON.stringify(result.res));
    const isEnd = announcements.length <= query.pageSize;
    if(!isEnd && announcements.length > 0) {
        announcements.pop();
    }
    return {
        announcements,
        isEnd,
        success: result.success
    };
};

const search = async function (req, res) {
    const context = req.params.context || req.query.context;
    let result;
    switch (context) {
    case "message":
        result = await searchMessage(req.query);
        res.status(200).json({
            success: result.success,
            message: "Search Messages",
            messages: result.messages,
            end: result.isEnd
        });
        break;
    case "user":
        result = await searchUser(req.query);
        res.status(200).json({
            success: result.success,
            message: "Search Users",
            users: result.users
        });
        break;
    case "announcement":
        result = await searchAnnouncement(req.query);
        res.status(200).json({
            success: result.success,
            message: "Search Announcement",
            messages: result.announcements,
            end: result.isEnd
        });
        break;
    default:
        break;
    }
};

module.exports = search;
