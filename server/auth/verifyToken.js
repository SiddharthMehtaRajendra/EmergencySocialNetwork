const jwt = require('jsonwebtoken');
const config = require('./config.js');

const exclude = {
    '/api/joinCheck': true,
    '/api/join': true
};

const checkToken = (req, res, next) => {
    // console.log(exclude[req.originalUrl]);
    if (exclude[req.originalUrl]) {
        next();
    } else {
        const token = req.headers.token;
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(200).json({
                        redirect: true,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    req.username = decoded.username;
                    next();
                }
            });
        } else {
            // TODO: Use res.location to redirect
            return res.status(200).json({
                redirect: true,
                message: 'Auth token is not supplied'
            });
        }
    }
};

module.exports = checkToken;
