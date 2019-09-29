const mongoose = require('../connectdb');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ChatSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
});

ChatSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
