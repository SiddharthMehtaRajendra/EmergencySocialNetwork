const Message = require("../../model/Message");
const Chat = require("../../model/Chat");

const getPublicChat = async function(){
    const latestPublicMessage = (await Message.latestPublic()).res;
    return {
        chatId: -1,
        from: latestPublicMessage.from,
        latestMessage: latestPublicMessage,
        otherUser: "public",
        to: "public",
        type: "public"
    };
};

const getPrivateChats = async function(username){
    const dbResult = await Chat.related(username);
    const chats = JSON.parse(JSON.stringify(dbResult.res)); // Mongoose Result can't be modified
    const chatsWithOtherUser = [];
    for(let i = 0; i < chats.length; i++) {
        if(chats[i].from !== username || chats[i].to !== username) {
            chats[i].otherUser = chats[i].from === username ? chats[i].to : chats[i].from;
            chatsWithOtherUser.push(chats[i]);
        }
    }
    return chatsWithOtherUser;
};

const chats = async function (req, res, next) {
    const publicChat = await getPublicChat();
    const username = (req.params && req.params.username) || req.username;
    const privateChats = await getPrivateChats(username);
    res.status(200).json({
        success: true,
        message: "Get Chats",
        chats: privateChats,
        public: publicChat
    });
};

module.exports = chats;
