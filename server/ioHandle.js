/* istanbul ignore file */

const jwt = require("jsonwebtoken");
const parseCookies = require("./lib/parseCookies");
const config = require("./auth/config");
const User = require("../model/User");
const Message = require("../model/Message");
const Chat = require("../model/Chat");
const processMsg = require("./lib/processMsg");

const verifyToken = function (socket, next) {
    const token = parseCookies(socket.request.headers.cookie).token;
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            socket.emit("AUTH_FAILED", {});
        } else {
            socket.handshake.username = decoded.username;
        }
    });
    next();
};

const onConnect = async function (socket, io) {
    await User.updateOnline(socket.handshake.username, true);
    await User.updateSocketId(socket.handshake.username, socket.id);
    io.emit("UPDATE_DIRECTORY", { data: "A User Online" });
};

const onDisconnect = async function (socket, io) {
    await User.updateOnline(socket.handshake.username, false);
    io.emit("UPDATE_DIRECTORY", { data: "A User Offline" });
};

const createChat = async function (type, chat, name) {
    const chatInsert = await Chat.insertOne({
        type: type,
        members: chat.members,
        latestMessage: null,
        name: name ? name : chat.members.sort().slice(0, 2).join("_")
    });
    return chatInsert.res;
};

const updateChat = async function (socket, io, msg, socketIds) {
    if(msg.to !== "public") {
        let chatId = msg.chatId;
        if(!chatId) {
            chatId = (await createChat("private", {
                members: [msg.from, msg.to],
                from: msg.from,
                to: msg.to
            }, null)).chatId;
        }
        const updateResult = await Chat.updateLatestMessage(chatId, msg);
        if(updateResult.success) {
            const result = JSON.parse(JSON.stringify(updateResult.res));
            for(let i = 0; i < socketIds.length; i++) {
                io.to(socketIds[i].id).emit("UPDATE_CHAT", Object.assign(result, { otherUser: socketIds[i].otherUser }));
            }
        }
    } else {
        io.emit("UPDATE_CHAT", {
            chatId: -1,
            from: msg.from,
            latestMessage: msg,
            otherUser: "public",
            to: "public",
            type: "public"
        });
    }
};

const updateMessage = async function (socket, io, msg, socketIds) {
    const MessageInsert = await Message.insertOne(msg);
    if(MessageInsert.success) {
        if(msg.to === "public") {
            io.emit("UPDATE_MESSAGE", MessageInsert.res);
        } else {
            for(let i = 0; i < socketIds.length; i++) {
                io.to(socketIds[i].id).emit("UPDATE_MESSAGE", MessageInsert.res);
            }
        }
    }
};

const onMessage = async function (socket, io, msg) {
    msg = processMsg(msg);
    let toSocketId = null;
    if(msg.to !== "public") {
        toSocketId = (await User.getOneUserByUsername(msg.to)).res[0].socketID;
    }
    const socketIds = [];
    socketIds.push({
        username: msg.from,
        id: socket.id,
        otherUser: msg.to
    });
    if(msg.from !== msg.to) {
        socketIds.push({
            username: msg.to,
            id: toSocketId,
            otherUser: msg.from
        });
    }
    await updateChat(socket, io, msg, socketIds);
    await updateMessage(socket, io, msg, socketIds);
};

module.exports = {
    verifyToken,
    onConnect,
    onDisconnect,
    onMessage
};


