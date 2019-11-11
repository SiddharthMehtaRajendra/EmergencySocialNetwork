const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

/* istanbul ignore next */
const InfoSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    contactNumber: {
        type: String
    },
    selfIntro: {
        type: String
    }
});

InfoSchema.statics.getInfoByUsername = async function (username) {
    let res = {};
    let success = false;
    res = await this.find({ username: username });
    if(res.length > 0){
        success = true;
    }
    return {
        success,
        res
    };
};

InfoSchema.statics.updateInformation = async function (userObject) {
    let res = {};
    let success = true;
    const exist = await this.getInfoByUsername(userObject.username);
    if(exist.success) {
        await this.deleteOne({username: userObject.username});
    };
    try {
        res = await this.create(userObject);
    } catch (e) {
        /* istanbul ignore else */
        res = "updateInformation error";
        success = false;
    }
    return {
        success,
        res
    };
};

InfoSchema.plugin(uniqueValidator);
const Info = mongoose.model("Info", InfoSchema);

module.exports = Info;
