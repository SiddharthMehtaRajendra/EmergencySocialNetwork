const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const http = require("http").createServer(app);
const port = process.env.PORT || 80;
const bodyParser = require("body-parser");
const User = require("../model/User");
const Message = require("../model/Message");
const Announcement = require("../model/Announcement");
const io = require("socket.io")(http);
const cookieParser = require("cookie-parser");
const { checkToken } = require("./auth/checkToken");
const { verifyToken, onConnect, onDisconnect, onMessage } = require("./ioHandle");
const controller = require("./controller/index");
require("./lib/connectdb");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser());
app.use(checkToken);
app.use("/app", express.static(path.resolve(__dirname, "../dist")));

// Socket IO config
io.set("origins", "*:*");
io.use(verifyToken);
io.on("connection", async (socket) => {
    await onConnect(socket, io);
    socket.on("MESSAGE", async (msg) => onMessage(socket, io, msg));
    socket.on("disconnect", () => onDisconnect(socket, io));
});

app.get("/heartbeat", async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Hello ESN!"
    });
});

app.post("/api/joinCheck", controller.joinCheck);

app.post("/api/join", controller.join);

app.get("/api/users", controller.users);

app.get("/api/user/:username?", controller.user);

app.get("/api/historyMessage", controller.historyMessage);

app.get("/api/chats", controller.chats);

app.get("/api/announcement", controller.announcement);

app.post("/api/updateStatus", async (req, res) => {
    const result = await controller.updateStatus(req, io);
    res.status(200).json(result);
});

const searchPublicMessage = async function (req) {
    const searchContent = deleteStopWords(req.body.searchMessage);
    let dbResult = { success: false };
    if(!searchContent || searchContent === "") {
        return dbResult;
    }
    const smallestMessageId = req.body.smallestMessageId;
    const pageSize = +(req.query && req.body.pageSize);
    dbResult = await Message.searchPublicMessage(searchContent, smallestMessageId, pageSize);
    return dbResult;
};

async function searchAnnouncements(req) {
    const searchTitle = req.body.searchTitle;
    const searchContent = req.body.searchAnnouncement;
    const smallestAnnouncementId = req.body.smallestAnnouncementId;
    const pageSize = +(req.query && req.body.pageSize);
    const dbResult = await Announcement.searchAnnouncements(searchTitle, searchContent, smallestAnnouncementId, pageSize);
    return dbResult;
};

const searchPrivateMessage = async function (req) {
    const searchContent = deleteStopWords(req.body.searchMessage);
    let dbResult = { success: false };
    if(searchContent === "") {
        return dbResult;
    }
    const smallestMessageId = req.body.smallestMessageId;
    const pageSize = +(req.query && req.body.pageSize);
    const username = req.body.username;
    dbResult = await Message.searchPrivateMessage(username, searchContent, smallestMessageId, pageSize);
    return dbResult;
};

async function searchUser(req) {
    const searchContent = req.body.searchUser;
    console.log("searchContent: " + searchContent);
    const dbResult = await User.searchUser(searchContent);
    return dbResult;
}

app.get("/api/search/:context", async (req, res) => {
    let dbResult = { success: false };
    const context = req.params.context;
    let endSign = true;
    let messages = null;
    if(contextual === "publicMessage") {
        dbResult = await searchPublicMessage(req);
        if(dbResult.success) {
            endSign = dbResult.res.length <= req.body.pageSize;
            messages = dbResult.res;
            if(!endSign & dbResult.res.length > 0) {
                messages = JSON.parse(JSON.stringify(dbResult.res));
                messages.pop();
            }
        }
    }
    if(contextual === "privateMessage") {
        dbResult = await searchPrivateMessage(req);
        console.log(dbResult);
        endSign = dbResult.res.length <= req.body.pageSize;
        messages = dbResult.res;
        if(!endSign && dbResult.res.length > 0) {
            messages = JSON.parse(JSON.stringify(dbResult.res));
            messages.pop();
        }
        if(dbResult.success) {
            res.status(200).json({
                success: true,
                message: "Get Messages",
                messages: messages,
                end: endSign
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Load Messages Failed"
            });
        }
    }
    if(contextual === "user") {
        let users = null;
        dbResult = await searchUser(req);
        console.log("searchUserResults" + dbResult);
        users = dbResult.res;
        if(dbResult.res.length > 0) {
            users = JSON.parse(JSON.stringify(dbResult.res));
        }
        if(dbResult.success) {
            res.status(200).json({
                success: true,
                message: "Get Users",
                users: users,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Load Users Failed"
            });
        }
    }
    if(contextual === "privateMessage") {
        dbResult = await searchPrivateMessage(req);
        if(dbResult.success) {
            endSign = dbResult.res.length <= req.body.pageSize;
            messages = dbResult.res;
            if(!endSign & dbResult.res.length > 0) {
                messages = JSON.parse(JSON.stringify(dbResult.res));
                messages.pop();
            }
        }
    }
    if(contextual === "announcement") {
        dbResult = await searchAnnouncements(req);
        endSign = dbResult.res.length <= req.body.pageSize;
        let announcements = dbResult.res;
        if(!endSign & dbResult.res.length > 0) {
            announcements = JSON.parse(JSON.stringify(dbResult.res));
            announcements.pop();
        }
        if(dbResult.success) {
            res.status(200).json({
                success: true,
                message: "Get Announcements",
                announcements: announcements,
                end: endSign
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Load Announcements Failed"
            });
        }
    }
});

http.listen(port, () => {
    console.log(`Express server start, listening on port:${port} ...`);
});
