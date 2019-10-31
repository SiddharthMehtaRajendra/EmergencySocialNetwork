const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../../server/auth/config");

const genUserName = function () {
    return uuid.v1().toString().replace(/-/g, "");
};

const createUser = function () {
    const username = genUserName();
    const token = jwt.sign({ username: username }, config.secret, { expiresIn: "24h" });
    return {
        username,
        token
    };
};

module.exports = {
    createUser,
    genUserName
};
