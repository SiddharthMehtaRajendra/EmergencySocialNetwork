const User = require("../../model/User");

const users = async function (req, res) {
    let dbResult;
    console.log("req.query.type: " + req.query.type);
    if(req.query.type === "doctor") {
        dbResult = await User.getAllDoctors();
    } else {
        dbResult = await User.getAllUsers();
    }
    /* istanbul ignore else */
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
