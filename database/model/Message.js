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

MessageSchema.statics.history = async function (from, to, smallestMessageId, pageSize) {
    let res = [];
    let success = true;
    try{
        if (to === 'public') {
            res = await Message.find({ to: 'public', id: { $lt: +smallestMessageId } }).sort({ id: -1 }).limit(pageSize);
        } else {
            res = await Message.find({ $or: [{ from: from, to: to }, { to: from, from: to }], id: { $lt: +smallestMessageId } }).sort({ id: -1 }).limit(pageSize);
        }
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
