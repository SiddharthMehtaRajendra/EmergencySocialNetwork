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
        avatar: avatar
    };
    if (validate(userObj.username, userObj.password)) {
        const result = await User.addOneUser(userObj);
        if (result.success) {
            // Register Success
            const token = jwt.sign({ username: req.body.username }, config.secret, { expiresIn: '24h' });
            //
            console.log(userObj);
            res.status(200).json({ success: true, message: 'Register Success', data: '', token: token });
        } else {
            // Username already exist
            res.status(200).json({ success: false, message: result.res, data: '' });
        }
    } else {
        res.status(200).json({ success: false, message: 'Validate Failed', data: '' });
    }
});

app.get('/api/users', async function (req, res) {
    try {
        const all = await User.find().sort({ username: 1 });
        res.status(200).json({ users: all });
    } catch (e) {
        console.log(e);
    }
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`);
});
