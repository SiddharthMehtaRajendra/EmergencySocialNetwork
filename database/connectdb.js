const mongoose = require('mongoose');
let url = 'mongodb://127.0.0.1/SB2ESN';
if (process.env.MONGODB_URI) {
    url = process.env.MONGODB_URI;
}

console.log(url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + url);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;
