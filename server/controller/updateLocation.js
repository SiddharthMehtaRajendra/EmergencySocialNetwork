const User = require("../../model/User");

const updateLocation = async function (req, io) {
    console.log(req.username);
    console.log(req.body);
    try {
        const res = await User.updateLocation(req.username || req.body.username, req.body.location);
        console.log(res);
        return {
            success: true,
            message: "Update location success"
        };
    } catch (e) {
        return {
            success: false,
            message: "Update location failed"
        };
    }
};

module.exports = updateLocation;
