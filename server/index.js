const express = require('express');
const app = express();
// const path = require('path');
const cors = require('cors');
const http = require('http').createServer(app);
const port = 8000;
const bodyParser = require('body-parser');
const validate = require('./lib/server-validation');
const User = require('../database/model/User');
require('../database/connectdb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Serve static front-end files, for future use
// app.use(express.static(path.resolve(__dirname, '../dist')));

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
                res.status(200).json({
                    success: true,
                    message: 'Validation Passed',
                    exists: true,
                    validationPass: true
                });
            }
        }
    }
});

app.post('/api/join', async function (req, res, next) {
    const userObj = {
        username: req.body.username,
        password: req.body.password
    };
    if (validate(userObj.username, userObj.password)) {
        const result = await User.addOneUser(userObj);
        if (result.success) {
            res.status(200).json({ success: true, message: 'Register Success', data: '' });
        } else {
            res.status(200).json({ success: false, message: result.res, data: '' });
        }
    } else {
        res.status(200).json({ success: false, message: 'Validate Failed', data: '' });
    }
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`);
});
