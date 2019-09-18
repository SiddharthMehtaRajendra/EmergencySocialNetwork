const mongoose = require('../connectdb');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.getOneUserByUsername = async function (username) {
    const res = await this.find({ username: username });
    return res;
};

UserSchema.statics.validateCredentials = async function (username, password) {
    const user = await this.find({ username: username });
    if (!user) {
        return false;
    } else {
        const res = await bcrypt.compare(password, password);
        return res;
    }
};

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);
module.exports = User;
