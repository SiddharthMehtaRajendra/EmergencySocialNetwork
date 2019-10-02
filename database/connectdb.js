const mongoose = require('mongoose');
// const url = 'mongodb://127.0.0.1/SB2ESN';
// { user: "heroku_n79vmv8t", account: "heroku_n79vmv8t",password:"f19sb2no1" }
// const url = 'mongodb://heroku_n79vmv8t:heroku_n79vmv8t@ds029824.mlab.com:29824/heroku_n79vmv8t';
const url = `${process.env.MONGODB_URI}/SB2ESN` || 'mongodb://127.0.0.1/SB2ESN';
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
