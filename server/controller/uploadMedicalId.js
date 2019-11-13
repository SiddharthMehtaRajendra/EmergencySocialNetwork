const User = require("../../model/User");

const uploadMedicaID = async function (req){
    const username = req.body.params.username || req.query.username;
    const helpCenterName = req.body.params.helpCenterName || req.query.helpCenterName;
    const medicalIdUploaded = true;
    const isSuccess = await User.uploadMedicalID(username, helpCenterName, medicalIdUploaded);
    /* istanbul ignore else */
    console.log(isSuccess);
    return isSuccess;
}

module.exports = uploadMedicaID;