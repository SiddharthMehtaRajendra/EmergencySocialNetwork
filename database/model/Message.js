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
    chatId: {
        type: Number
    },
    status: {
        type: String
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

MessageSchema.statics.history = async function (chatId, smallestMessageId, pageSize) {
    let res = [];
    let success = true;
    try {
        res = await Message.find({ chatId: chatId, id: { $lt: +smallestMessageId } }).sort({ id: -1 }).limit(pageSize);
        res = res.reverse();
    } catch (e) {
        res = e._message;
        success = false;
    }
    return { success, res };
};

MessageSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
