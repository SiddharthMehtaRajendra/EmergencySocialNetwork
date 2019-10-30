const User = require("../../model/User");

const users = async function (req, res) {
    const dbResult = await User.getAllUsers();
    if(dbResult.success) {
        res.status(200).json({
            success: true,
            message: "All Directory",
            users: dbResult.res
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
