const jwt = require("jsonwebtoken");
const validate = require("../lib/server-validation");
const User = require("../../model/User");
const buildRes = require("../lib/buildRes");
const config = require("../auth/config");

const MSG = {
    NOT_EXIST: "User Not Exists",
    WRONG_NAME_PASSWORD: "Enter the correct username and password",
    PASS: "Validation Passed",
    VALID_FAILED: "Validation Failed"
};

const joinCheck = async function(req,res,next){
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    if(validate(user.username, user.password)) {
        const exist = await User.exists(user.username);
        // User not exists
        if(!exist) {
            res.status(200).json(buildRes(false, MSG.NOT_EXIST, {
                exists: false,
                validationPass: null
            }));
        } else {
            // User exits, build password wrong
            if(!await User.validateCredentials(user.username, user.password)) {
                res.status(200).json(buildRes(false, MSG.WRONG_NAME_PASSWORD, {
                    exists: null,
                    validationPass: false
                }));
            } else {
                // User exits, password correct
                const token = jwt.sign({ username: user.username }, config.secret, { expiresIn: "24h" });
                res.status(200).json(buildRes(true,MSG.PASS,{
                    exists: true,
                    validationPass: true,
                    token: token
                }));
            }
        }
    } else {
        res.status(200).json(buildRes(false,MSG.VALID_FAILED,{
            exists: null,
            validationPass: false
        }));
    }
};

module.exports = joinCheck;
