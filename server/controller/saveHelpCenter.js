const User = require("../../model/User");

const saveHelpCenterPreference = async function (req){
    const username = req.body.params.username || req.query.username;
    const helpCenterName = req.body.params.helpCenterName || req.query.helpCenterName;
    const helpCenterAddress = req.body.params.helpCenterAddress || req.query.helpCenterAddress;
    const isSuccess = await User.saveHelpCenter(username, helpCenterName, helpCenterAddress);
    /* istanbul ignore else */
    return isSuccess;
}

module.exports = saveHelpCenterPreference;