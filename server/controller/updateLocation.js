const User = require("../../model/User");

const updateLocation = async function (req, io) {
    try {
        const res = await User.updateLocation(req.username || req.body.username, req.body.location, req.body.sharingLocationOpen);
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
