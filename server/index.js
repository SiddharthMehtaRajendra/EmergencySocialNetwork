const express = require('express');
const serverValidation = require('./server-validation');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const port = 8000;
const User = require('../models/user.js');
const connectDB = require('./connectdb');
const seedDB = require('./seeds');

const removedUser = async () => {
    return await User.removeOneUserByUsername('siddharthmehta');
};

removedUser().then(() => {
    console.log('Done');
}).catch((error) => {
    console.log(error);
});

//     const addedUser = await User.addOneUser({
//     username: "yuanwent",
//     password: "abcd1234"
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', async function (req, res, next) {
    console.log('/api/test Get Request');
    res.status(200).json({ success: true, message: 'Test OK', data: 'Test OK' });
});

app.post('/api/register', async function (req, res, next) {
    if(!await serverValidation.validateCredentials(req.body.username, req.body.password)){
        res.status(401).json({ success: false, message: 'Invalid Credentials', data: 'Invalid Credentials' });
    }
    res.status(200).json({ success: true, message: 'Register OK', data: 'Register OK' });
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`);
});
