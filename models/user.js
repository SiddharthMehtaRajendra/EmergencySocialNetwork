const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
    // acknowledgeStatus: {type: Boolean, default: false},
    // acknowledgedAt: {type: Date, default: Date.now}
});

userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

userSchema.statics.userExists = async function(username) {
    return User.exists({username: username});
}
 
userSchema.statics.getOneUserByUsername = async function(username) {
    return User.findOne({username: username}, function(err, newlyFoundUser){
        if(err) {
            console.log(err);
        } else {
            // console.log("Found user: " + newlyFoundUser.username);
        }
    });
}

userSchema.statics.removeOneUserByUsername = async function(username) {
    return User.remove({username: username}, function(err){
        if(err) {
            console.log(err);
        } else {
            // console.log("Removed " + username + " from the users collections");
        }
    })
}

userSchema.statics.addOneUser = async function(userObject) {
    User.create(userObject, function(err, user){
        if(err){
            console.log(err);
        } else {
            // console.log("Added " + user.username + " to the users collections");
        }
    });
}

const User = mongoose.model("User", userSchema)

module.exports = User;
