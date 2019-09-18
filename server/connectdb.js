const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/SB2ESN";
const connectDB = mongoose.connect(url, {useNewUrlParser: true});

module.exports = connectDB;
