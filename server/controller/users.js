const User = require("../../model/User");
const wrapUserData = require("../lib/wrapUserData");

const users = async function (req, res) {
    const dbResult = await User.getAllUsers();
    /* istanbul ignore else */
    if(dbResult.success) {
        res.status(200).json({
            success: true,
            message: "All Directory",
            users: wrapUserData(dbResult.res)
        });
    } else {
        res.status(200).json({
            success: false,
            message: dbResult.res,
            users: []
        });
    }
};

module.exports = users;
