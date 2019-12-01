const randomColor = require("randomcolor");
const jwt = require("jsonwebtoken");
const config = require("../auth/config");
const validate = require("../lib/server-validation");
const User = require("../../model/User");
const buildRes = require("../lib/buildRes");

const join = async function(req,res,next){
    const avatar = randomColor({
        luminosity: "light"
    });
    const user = {
        username: req.body.username,
        password: req.body.password,
        avatar: avatar,
        status: "ok",
        statusUpdateTime: new Date(),
        online: true,
        isDoctor: req.body.isDoctor,
        privilege: "citizen",
        shareList: [req.body.username],
        adminStatus: "active"
    };
    if(validate(user.username, user.password)) {
        const result = await User.addOneUser(user);
        if(result.success) {
            const token = jwt.sign({ username: req.body.username }, config.secret, { expiresIn: "24h" });
            res.status(200).json(buildRes(true,"Register Success",{token: token}));
        } else {
            res.status(200).json({
                success: false,
                message: result.res
            });
        }
    } else {
        res.status(200).json({
            success: false,
            message: "Validate Failed"
        });
    }
};

module.exports = join;
