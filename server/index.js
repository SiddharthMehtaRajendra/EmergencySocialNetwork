const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const port = 8000;
const connectDB = require("./connectdb");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const User  =require('../models/user');

app.get('/api/test', async function (req, res, next) {
    console.log('/api/test Get Request');
    res.status(200).json({ success: true, message: 'Test OK', data: 'Test OK' });
});

app.post('/api/register', async function (req, res, next) {
    const userObj = {
        username: req.body.username,
        password: req.body.password
    };
    if (validate(userObj.username, userObj.password)) {
        const result = await addUser(userObj);
        if (result.success) {
            res.status(200).json({ success: true, message: 'Add One User Successfully', data: '' });
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
