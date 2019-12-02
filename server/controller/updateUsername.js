const Chat = require("../../model/Chat");
const Announcement = require("../../model/Announcement");
const Message = require("../../model/Message");
const Info = require("../../model/Info");

const updateUsername = async function (req, res, next) {
    const newUsername = req.body.params.newUsername;
    const oldUsername = req.body.params.oldUsername;
    await Chat.updateUsername(oldUsername, newUsername);
    await Announcement.updateUsername(oldUsername, newUsername);
    await Message.updateUsername(oldUsername, newUsername);
    await Info.updateUsername(oldUsername, newUsername);
    res.status(200).json({
        success: true,
    });
};

module.exports = updateUsername;