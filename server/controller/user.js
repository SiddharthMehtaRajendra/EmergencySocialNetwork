const User = require("../../model/User");
const wrapUserData = require("../lib/wrapUserData");

const user = async function (req,res) {
    const username = (req.params && req.params.username) || req.username;
    const result = await User.getOneUserByUsername(username);
    const user = result.res[0] || {};
    res.status(200).json({
        success: result.success,
        message: result.success ? "Get User info OK" : result.res,
        user: wrapUserData(user)
    });
};

module.exports = user;
