let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let http = require('http').createServer(app);
const port = 8000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/test', async function (req, res, next) {
    console.log('/api/test Get Request');
    res.status(200).json({success: true, message: 'Test OK', data: "Test OK"})
});

http.listen(port, function () {
    console.log(`Express server start, listening on port:${port} ...`)
});
