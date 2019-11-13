const User = require("../../model/User");

const user = async function (req,res) {
    const username = (req.params && req.params.username) || req.username;
    const result = await User.getOneUserByUsername(username);
    const user = result.res[0] || {};
    res.status(200).json({
        success: result.success,
        message: result.success ? "Get User info OK" : result.res,
        user: {
            username: user.username || null,
            avatar: user.avatar || "#ccc",
            online: user.online || false,
            status: user.status || "ok",
            isDoctor: user.isDoctor || false
        }
    });
};

module.exports = user;

