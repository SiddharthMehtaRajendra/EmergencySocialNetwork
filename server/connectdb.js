const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/SB2ESN";
const connectdb = mongoose.connect(url, {useNewUrlParser: true});

//add a user
function addOneUser(){
    User.create(seed, function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log("added to the user");
        }
    });
}

//delete a user
function removeOneUser(){
    User.create(seed, function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log("added to the user");
        }
    });
}

module.exports = connectdb;
