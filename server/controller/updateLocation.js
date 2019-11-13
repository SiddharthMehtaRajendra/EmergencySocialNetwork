const User = require("../../model/User");

const updateLocation = async function (req, io) {
    try {
        await User.updateLocation(req.username, req.body.location, req.body.sharingLocationOpen);
        console.log(req.body);
        io.emit("UPDATE_USER_LOCATION",{
            username: req.username,
            location: req.body.location,
            sharingLocationOpen: req.body.sharingLocationOpen
        });
        return {
            success: true,
            message: "Update location success"
        };
    } catch (e) {
        /* istanbul ignore next */
        console.log(e);
        return {
            success: false,
            message: "Update location failed"
        };
    }
};

module.exports = updateLocation;
