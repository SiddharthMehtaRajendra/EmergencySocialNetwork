const jwt = require('jsonwebtoken');
const config = require('./config.js');

const exclude = {
    '/api/joinCheck': true,
    '/api/join': true
};

const checkToken = (req, res, next) => {
    console.log(req.originalUrl);
    if (exclude[req.originalUrl]) {
        next();
    } else {
        // const token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
        console.log(req.cookies);
        const token = req.cookies && req.cookies.token;
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    console.log(decoded);
                    // note, the exp time here is 10 digit, not 13!
                    next();
                }
            });
        } else {
            // TODO: Use res.location to redirect
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }
};

module.exports = checkToken;
