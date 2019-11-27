
const User = require("../../model/User");

const addPrivateDoctor = async function (req, res) {
    const username1 = req.body.username1;
    const username2 = req.body.username2;
    const result = await User.addIntoAssociatedLists(username1, username2);
    res.status(200).json({
        success: result.success,
        message: result.success ? "Add Private Doctor Successfully" : "Add Private Doctor Failed",
        result: result
    });
};

module.exports = addPrivateDoctor;