const jwt = require('jsonwebtoken');
const config = require('./config.js');

const exclude = {
    '/heartbeat': true,
    '/api/joinCheck': true,
    '/api/join': true
};

const checkToken = (req, res, next) => {
    if (exclude[req.originalUrl]) {
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
