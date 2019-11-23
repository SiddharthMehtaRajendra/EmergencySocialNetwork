const User = require("../../model/User");

const removePrivateDoctor = async function (req, res) {
    const username1 = req.body.username1;
    const username2 = req.body.username2;
    const result = await User.removeFromAssociatedLists(username1, username2);
    res.status(200).json({
        success: result.success,
        message: result.success ? "Remove Private Doctor Successfully" : "Remove Private Doctor Failed",
        result: result
    });
};

module.exports = removePrivateDoctor;