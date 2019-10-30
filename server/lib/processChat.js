const processChat = function(type, members) {
    return {
        type: type,
        members: members,
        latestMessage: null
    };
};

module.exports = processChat;
