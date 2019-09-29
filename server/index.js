const express = require('express');
const app = express();
// const path = require('path');
const cors = require('cors');
const http = require('http').createServer(app);
const port = 8000;
const bodyParser = require('body-parser');
const validate = require('./lib/server-validation');
const User = require('../database/model/User');
const Message = require('../database/model/Message');
const io = require('socket.io')(http);
io.set('origins', '*:*');
const jwt = require('jsonwebtoken');
const config = require('./auth/config');
const cookieParser = require('cookie-parser');
var checkToken = require('./auth/middleware');
require('../database/connectdb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(checkToken());

function parseCookies(cookieStr) {
    const list = {};
    cookieStr && cookieStr.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

io.use((socket, next) => {
    console.log('--------');
    console.log(socket.request.headers.cookie);
    const cookieStr = socket.request.headers.cookie;
    // socket.request.headers.username = parseCookies(cookieStr).token;

    socket.username = parseCookies(cookieStr).token;
    console.log(socket.username);
    console.log('-------');
    next();
});

io.on('connection', function (socket) {
    socket.on('MSG', async function (msg) {
        console.log(socket.username);
        console.log('Socket Msg here');
        console.log(msg);
    });
});

app.get('/heartbeat', async function (req, res, next) {
    console.log('Hello ESN Node Server');
    res.status(200).json({ success: true, message: 'Hello ESN Node Server', data: {} });
});

app.post('/api/joinCheck', async function (req, res, next) {
    const userObj = {
        username: req.body.username,
        password: req.body.password
    };
    if (validate(userObj.username, userObj.password)) {
        const exist = await User.exists(userObj.username);
        if (!exist) {
            res.status(200).json({
                success: false,
                message: 'User Not Exists',
                exists: false,
                validationPass: null
            });
        } else {
            if (!await User.validateCredentials(userObj.username, userObj.password)) {
                res.status(200).json({
                    success: false,
                    message: 'Enter the correct username and password',
                    exists: null,
                    validationPass: false
                });
            } else {
                //login successfully
                let token = jwt.sign({username: req.body.username},
                  config.secret,
                  { expiresIn: '24h' // expires in 24 hours
                  }
                );   

                res.status(200).json({
                    success: true,
                    message: 'Validation Passed',
                    exists: true,
                    validationPass: true,
                    token: token
                });
            }
        }
    }
});

// register
app.post('/api/join', async function (req, res, next) {
    const randomColor = require('randomcolor');
    const avatar = randomColor({
        luminosity: 'light'
    });
    const userObj = {
        username: req.body.username,
        password: req.body.password,
        avatar: avatar
    };
    if (validate(userObj.username, userObj.password)) {
        const result = await User.addOneUser(userObj);
        if (result.success) {
            // Register Success
            const token = jwt.sign({ username: req.body.username },
                config.secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            res.status(200).json({ success: true, message: 'Register Success', data: '', token: token });
        } else {
            // Username already exist
            res.status(200).json({ success: false, message: result.res, data: '' });
        }
    } else {
        res.status(200).json({ success: false, message: 'Validate Failed', data: '' });
    }
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`);
});
