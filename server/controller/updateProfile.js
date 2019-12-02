const User = require("../../model/User");

const updateProfile = async function (req, res, next) {
    const updateRes = {success: false};
    const newUsername = req.body.params.newUsername;
    let userExisted;
    try {
        if(newUsername === req.body.params.oldUsername){
            userExisted = false;
            console.log("test1");
        } else {
            userExisted = await User.exists(newUsername);
            console.log(userExisted);
        }
        if(userExisted){
            res.status(200).json({
                success: false,
                err: "username exsiteed",
                info: null,
            });
            console.log("test3");
        } else {
            const profileInfo = {
                oldUsername: req.body.params.oldUsername,
                newUsername: req.body.params.newUsername,
                password: req.body.params.password,
                privilege: req.body.params.privilegeType,
                adminStatus: req.body.params.accountType
            };
            const updateRes = await User.updateProfile(profileInfo);
            res.status(200).json({
                success: true,
                info: updateRes.res,
            });
            console.log("test4");
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