const express = require('express');
const app = express();
// const path = require('path');
const cors = require('cors');
const http = require('http').createServer(app);
const port = 8000;
const bodyParser = require('body-parser');
const validate = require('./lib/server-validation');
const User = require('../database/model/User');
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const config = require('./auth/config');
const randomColor = require('randomcolor');
const cookieParser = require('cookie-parser');
const checkToken = require('./auth/checkToken');
require('../database/connectdb');

io.set('origins', '*:*');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(checkToken);

// Serve static front-end files, for future use
// app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/heartbeat', async function (req, res, next) {
    console.log('Hello ESN!');
    res.status(200).json({ success: true, message: 'Hello ESN!', data: {} });
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
            // login failed
            if (!await User.validateCredentials(userObj.username, userObj.password)) {
                res.status(200).json({
                    success: false,
                    message: 'Enter the correct username and password',
                    exists: null,
                    validationPass: false
                });
            } else {
                // login successfully
                const token = jwt.sign({ username: userObj.username }, config.secret, { expiresIn: '24h' });
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
    const avatar = randomColor({
        luminosity: 'light'
    });
    const userObj = {
        username: req.body.username,
        password: req.body.password,
        avatar: avatar,
        status: 'OK',
        online: true
    };
    if (validate(userObj.username, userObj.password)) {
        const result = await User.addOneUser(userObj);
        if (result.success) {
            const token = jwt.sign({ username: req.body.username }, config.secret, { expiresIn: '24h' });
            res.status(200).json({ success: true, message: 'Register Success', token: token });
        } else {
            res.status(200).json({ success: false, message: result.res });
        }
    } else {
        res.status(200).json({ success: false, message: 'Validate Failed' });
    }
});

app.get('/api/users', async function (req, res) {
    try {
        const result = await User.find().sort({ username: 1 });
        const all = result.map(item => ({
            username: item.username,
            avatar: item.avatar || '#ccc',
            status: item.status || 'ok',
            online: item.online || false
        }));
        res.status(200).json({ success: true, message: 'All Directory', users: all });
    } catch (e) {
        res.status(200).json({ success: false, message: e._message });
    }
});

app.get('/api/user/:username?', async function (req, res) {
    const username = (req.params && req.params.username) || req.username;
    const result = await User.getOneUserByUsername(username);
    const user = result.res[0];
    res.status(200).json({
        success: result.success,
        message: result.success ? 'Get User info OK' : result.res,
        user: {
            username: user.username,
            avatar: user.avatar || '#ccc',
            online: user.online || false,
            status: user.status || 'OK'
        }
    });
});

app.get('/api/historyMessage/:chatId', async function (req, res) {
    console.log(req.params);
    res.status(200).json({
        success: true,
        message: 'Get History Message OK',
        messageList: [
            {
                time: 'time here',
                from: 'Wayne',
                to: 'public',
                type: 'text',
                content: 'content here',
                chatId: '123456'
            }
        ]
    });
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`);
});
