const Info = require("../../model/Info");

const updateInformation = async function (req, res, next) {
    const updateRes = {success: false};
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
        const updateRes = await Info.updateInformation(userInfo);
        res.status(200).json({
            success: true,
            info: updateRes.res,
        });
    } catch (e) {
        res.status(200).json({
            success: false,
            info: null,
        });
    }
};

module.exports = updateInformation;