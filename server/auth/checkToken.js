const jwt = require('jsonwebtoken');
const config = require('./config.js');

function exclude(url) {
    const urlTable = {
        '/heartbeat': true,
        '/api/joinCheck': true,
        '/api/join': true,
        '/': true,
        '/app': true
    };
    if (urlTable[url]) {
        return true;
    }
    if (url.indexOf('app') >= 0) {
        return true;
    }
    return false;
}

const checkToken = (req, res, next) => {
    if (exclude(req.originalUrl)) {
        next();
    } else {
        const token = (req.cookies && req.cookies.token) || (req.headers && req.headers.token);
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.status(200).json({ success: false, message: 'Auth Failed', redirect: true });
                } else {
                    req.username = decoded.username;
                    next();
                }
            });
        } else {
            res.status(200).json({ success: false, message: 'Auth Failed', redirect: true });
        }
    }
};

module.exports = checkToken;
