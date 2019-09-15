var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});



userSchema.statics.userExists = async function(username) {
    return User.exists({username: username});
}
 
userSchema.statics.getOneUserByUsername = async function(username) {
    return User.findOne({username: username}, function(err, newlyFoundUser){
        if(err) {
            console.log(err);
        } else {
            console.log("found User" + newlyFoundUser);
        }
    });
}

userSchema.statics.removeOneUserByUsername = async function(username) {
    return User.remove({username: username}, function(err){
        if(err) {
            console.log(err);
        } else {
            //console.log("remove");
        }
    })
}



userSchema.statics.addOneUser = async function(userObject) {
    User.create(userObject, function(err, user){
        if(err){
            console.log(err);
        } else {
            console.log("added" + user + "to the user collections");
        }
    });
}

const User = mongoose.model("User", userSchema)

module.exports = User;
