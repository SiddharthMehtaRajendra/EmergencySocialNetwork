const Info = require("../../model/Info");

const info = async function (req,res) {
    const username = (req.params && req.params.username) || req.username;
    console.log(username);
    const result = await Info.getInfoByUsername(username);

    const info = result.res[0] || {};
    res.status(200).json({
        success: result.success,
        message: result.success ? "Get User info OK" : result.res,
        info: info
    });
};

module.exports = info;
