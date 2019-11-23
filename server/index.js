/* istanbul ignore file */

const express = require("express");
const app = express();
const expressStaticGzip = require("express-static-gzip");
const path = require("path");
const cors = require("cors");
const http = require("http").createServer(app);
const port = process.env.PORT || 80;
const bodyParser = require("body-parser");
const io = require("socket.io")(http);
const cookieParser = require("cookie-parser");
const { checkToken } = require("./auth/checkToken");
const { verifyToken, onConnect, onDisconnect, onMessage, onConfirmMessage, onDoctorConfirm, onRemoveDoctor, onStatusChangeMessage } = require("./ioHandle");
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
// app.use("/app", express.static(path.resolve(__dirname, "../dist")));

app.use("/app", expressStaticGzip(path.resolve(__dirname, "../dist"),{
    enableBrotli: true,
    customCompressions: [{
        encodingName: "deflate",
        fileExtension: "zz"
    }],
    orderPreference: ["br"]
}));

// Socket IO config
io.set("origins", "*:*");
io.use(verifyToken);
io.on("connection", async (socket) => {
    await onConnect(socket, io);
    socket.on("MESSAGE", async (msg) => onMessage(socket, io, msg));
    socket.on("CONFIRM_MESSAGE", async (msg) => onConfirmMessage(socket, io, msg));
    socket.on("STATUS_CHANGE_MESSAGE", async (msg) => onStatusChangeMessage(socket, io, msg));
    socket.on("CONFIRM_ADD_DOCTOR", async (pair) => onDoctorConfirm(socket, io, pair));
    socket.on("REMOVE_DOCTOR", async (pair) => onRemoveDoctor(socket, io, pair));
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

app.get("/api/helpSearch", controller.helpSearch);

app.get("/api/preferredHelpCenters", controller.preferredHelpCenters);

app.post("/api/updateStatus", async (req, res) => {
    const result = await controller.updateStatus(req, io);
    res.status(200).json(result);
});

app.post("/api/postAnnouncement", async (req, res) => {
    const result = await controller.postAnnouncement(req, io);
    res.status(200).json(result);
});

app.post("/api/saveHelpCenter", async (req, res) => {
    const result = await controller.saveHelpCenter(req);
    res.status(200).json(result);
});

app.post("/api/uploadMedicalId", async (req, res) => {
    const result = await controller.uploadMedicalId(req);
    res.status(200).json(result);
});

app.get("/api/search", controller.search);

app.post("/api/addPrivateDoctor", controller.addPrivateDoctor);

app.post("/api/removePrivateDoctor", controller.removePrivateDoctor);


http.listen(port, () => {
    console.log(`Express server start, listening on port:${port} ...`);
});
