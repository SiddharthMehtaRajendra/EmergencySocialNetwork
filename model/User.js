const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const preferenceSchema = new mongoose.Schema({
    helpCenterName: {
        type: String
    },
    helpCenterAddress: {
        type: String
    },
    medicalIdUploaded: {
        type: Boolean
    }
});

/* istanbul ignore next */
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
    },
    avatar: {
        type: String,
        required: true
    },
    online: {
        type: Boolean
    },
    status: {
        type: String
    },
    socketID: {
        type: String
    },
    statusUpdateTime: {
        type: Date
    },
    savedHelpCenters: [preferenceSchema]
});

UserSchema.statics.exists = async function (username) {
    const findResult = await this.findOne({ username: username });
    return !!findResult;
};

UserSchema.statics.saveHelpCenter = async function (username, preferenceName, preferenceAddress) {
    let res = {};
    let success = true;
    const user = await this.findOne({username: username});
    try {
        user.savedHelpCenters.push({helpCenterName: preferenceName, helpCenterAddress: preferenceAddress, medicalIdUploaded: false});
        await user.save();
    } catch(e){
        success = false;
    }
    return success;
};

UserSchema.statics.uploadMedicalID = async function (username, preferenceName, medicalIdUploaded) {
    let res = {};
    let success = true;
    try {
        await this.findOne({'username': username}).then((user) => {
            for(let i=0; i < user.savedHelpCenters.length; i++){
                const savedHelpCenter = user.savedHelpCenters[i];
                if(savedHelpCenter.helpCenterName === preferenceName){
                    savedHelpCenter.medicalIdUploaded = medicalIdUploaded;
                }
            }
            user.save()
        });
    } catch(e){
        success = false;
    }
    return success;
};

UserSchema.statics.fetchPreferredHelpCenters = async function (username) {
    let res = [];
    let success = true;
    try {
        const result = await this.findOne({username});
        /* istanbul ignore next */
        res = result.savedHelpCenters;
    } catch (e) {
        success = false;
        res = e._message;
    }
    return res;
};

UserSchema.statics.getOneUserByUsername = async function (username) {
    let res = {};
    let success = true;
    try {
        res = await this.find({ username: username });
    } catch (e) {
        success = false;
        res = e._message;
    }
    return {
        success,
        res
    };
};

UserSchema.statics.getAllUsers = async function () {
    let res = [];
    let success = true;
    try {
        const rawResult = await this.find().sort({
            online: -1,
            username: 1
        });
        /* istanbul ignore next */
        res = rawResult.map((item) => ({
            username: item.username,
            avatar: item.avatar || "#ccc",
            status: item.status || "ok",
            online: item.online || false
        }));
    } catch (e) {
        success = false;
        res = e._message;
    }
    return {
        success,
        res
    };
};

UserSchema.statics.updateStatus = async function (username, status) {
    const res = await this.updateOne({ username: username }, {
        status: status,
        statusUpdateTime: new Date()
    });
    return res;
};

UserSchema.statics.updateOnline = async function (username, online) {
    const res = await this.updateOne({ username: username }, { online: online });
    return res;
};

UserSchema.statics.updateSocketId = async function (username, socketID) {
    const res = await this.updateOne({ username: username }, { socketID: socketID });
    return res;
};

UserSchema.statics.addOneUser = async function (userObject) {
    let res = {};
    let success = true;
    try {
        res = await this.create(userObject);
    } catch (e) {
        /* istanbul ignore else */
        if(e.errors && e.errors.username && e.errors.username.kind && e.errors.username.kind === "unique") {
            res = "Username already exist";
        } else {
            /* istanbul ignore next */
            res = e._message;
        }
        success = false;
    }
    return {
        success,
        res
    };
};

UserSchema.statics.validateCredentials = async function (username, password) {
    const user = await this.findOne({ username: username });
    if(!user || user.length === 0) {
        return false;
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    }
};

UserSchema.statics.searchUser = async function (searchContent) {
    let res = [];
    let success = true;
    try {
        res = await this.find({
            username: { $regex: searchContent },
        }).sort({
            online: -1,
            username: 1
        });
    } catch (e) {
        /* istanbul ignore next */
        res = e._message;
        /* istanbul ignore next */
        success = false;
    }
    return {
        success,
        res
    };
};

UserSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.plugin(uniqueValidator);
const User = mongoose.model("User", UserSchema);

module.exports = User;
