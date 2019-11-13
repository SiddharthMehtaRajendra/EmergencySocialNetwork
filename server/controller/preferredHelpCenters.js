const User = require("../../model/User");

const preferredHelpCenters = async function (req, res){
    const username = req.params.username || req.query.username;
    const dbResult = await User.fetchPreferredHelpCenters(username);
    /* istanbul ignore else */
    if(dbResult && dbResult.length > 0){
        res.status(200).json({
            success: true,
            message: "Get Preferred Centers",
            results: dbResult
        });
    } else {
        res.status(200).json({
            success: false,
            message: "No Preferred Centers",
            results: []
        });
    }
}

module.exports = preferredHelpCenters;