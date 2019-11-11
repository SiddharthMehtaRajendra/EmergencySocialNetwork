const Info = require("../../model/Info");

const updateInformation = async function (req, res, next) {
    try {
        const userInfo = {
            username: req.username,
            name: req.body.params.name,
            phoneNumber: req.body.params.phoneNumber,
            address: req.body.params.address,
            contactNumber: req.body.params.contactNumber,
            selfIntro: req.body.params.selfIntro,
            shareList: req.body.params.shareList
        };
        res = await Info.updateInformation(userInfo);
        return {
            success: true,
            message: "Update infomation success"
        };
    } catch (e) {
        return {
            success: false,
            message: "Update information failed"
        };
    }
};

module.exports = updateInformation;