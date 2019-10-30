const processMsg = function(msg) {
    return {
        time: new Date(),
        from: msg.from,
        to: msg.to,
        type: msg.type,
        content: msg.content,
        status: msg.status,
        chatId: msg.chatId
    };
};

module.exports = processMsg;
