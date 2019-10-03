const mongoose = require('../connectdb');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MessageSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    type: {
        type: String
    },
    content: {
        type: String
    },
    status: {
        type: String
    },
    chatId: {
        type: Number
    }
});

MessageSchema.statics.insertOne = async function (message) {
    let res = {};
    let success = true;
    message.time = new Date();
    try {
        res = await this.create(message);
    } catch (e) {
        res = e._message;
        success = false;
    }
    return { success, res };
};

MessageSchema.statics.getMessagesForPublicWall = async function () {
    let res = {};
    try {
        res = await this.find({});
    } catch (e) {
        res = e._message;
    }
    return { res };
};

MessageSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
