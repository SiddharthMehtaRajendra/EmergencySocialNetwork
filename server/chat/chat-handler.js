const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Message = require('../../database/model/Message')
require('../database/connectdb');

io.set('origins', '*:*');

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('MESSAGE', (message, callback) => {
        sendMessage(message).then((isMessageSent) => {
            if (isMessageSent) {
                return callback()
            }
        }).catch((error) => {
            return callback(error)
        })
    });
});

const sendMessage = async (message) => {
    try {
        const user = await Message.insert(message)
        if (user) {
            socket.emit('message', generateMessage('Me', message.text))
            socket.broadcast.to(CHAT_ROOM).emit('message', generateMessage(user.username, message.text))
            await User.appendToMessageDump(user.username, message.text, new Date().getTime())
            return true
        }
    } catch (e) {
        throw new Error(e)
    }
    return false
}