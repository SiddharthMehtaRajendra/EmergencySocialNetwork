const User = require("../../model/User");

const updateProfile = async function (req, res, next) {
    const updateRes = {success: false};
    const newUsername = req.body.params.newUsername;
    try {
        const userExisted = await User.exists(newUsername);
        if(userExisted){
            res.status(200).json({
                success: false,
                err: "username exsiteed",
                info: null,
            });
        } else {
            const profileInfo = {
                oldUsername: req.body.params.oldUsername,
                newUsername: req.body.params.newUsername,
                password: req.body.params.password,
                privilege: req.body.params.privilegeType,
                adminStatus: req.body.params.accountType
            };
            const updateRes = await User.updateProfile(profileInfo);
            console.log(updateRes);
            res.status(200).json({
                success: true,
                info: updateRes.res,
            });
        }  
    } catch (e) {
        res.status(200).json({
            success: false,
            err: "operation failed",
            info: null,
        });
    }
};

module.exports = updateProfile;