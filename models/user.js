const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
    username: String,
    password: String
    // acknowledgeStatus: {type: Boolean, default: false},
    // acknowledgedAt: {type: Date, default: Date.now}
});

userSchema.statics.userExists = async function (username) {
    return await User.exists({ username: username });
};

userSchema.statics.getOneUserByUsername = async function (username) {
    return await User.findOne({ username: username }, function (err, newlyFoundUser) {
        if (err) {
            console.log(err);
        } else {
            console.log('found User' + newlyFoundUser);
        }
    });
};

userSchema.statics.removeOneUserByUsername = async function (username) {
    return await User.remove({ username: username }, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("remove");
        }
    });
};

userSchema.statics.addOneUser = async function (userObject) {
    User.create(userObject, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log('added' + user + 'to the user collections');
        }
    });
};

userSchema.statics.validateCredentials = async function (username, password) {
    const user = await User.findOne({username: username});
    if(!user){
        return false;
    } else {
        const isMatch = await bcrypt.compare(password, password);
        return isMatch;
    }
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
