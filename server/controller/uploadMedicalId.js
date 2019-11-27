const User = require("../../model/User");

const uploadMedicaID = async function (req){
    const username = req.body.params.username;
    const helpCenterName = req.body.params.helpCenterName;
    const medicalIdUploaded = true;
    const isSuccess = await User.uploadMedicalID(username, helpCenterName, medicalIdUploaded);
    /* istanbul ignore else */
    console.log(isSuccess);
    return isSuccess;
}

module.exports = uploadMedicaID;