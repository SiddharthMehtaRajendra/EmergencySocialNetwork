const User = require("../../model/User");

const updateStatus = async function (req, io) {
    try {
        await User.updateStatus(req.body.username, req.body.status);
        io.emit("UPDATE_DIRECTORY", { data: "User Status Change" });
        return {
            success: true,
            message: "Update status success"
        };
    } catch (e) {
        return {
            success: false,
            message: "Update status failed"
        };
    }
};

module.exports = updateStatus;
