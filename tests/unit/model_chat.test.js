/* eslint-disable no-undef */
const Chat = require('../../database/model/Chat');

describe('Chat DB Test', () => {
    const oneMessage = {
        time: new Date(),
        from: 'user1',
        to: 'user2',
        type: '0',
        content: 'For Chat Test',
        status: 'ok',
        read: false,
        chatId: -1
    };
    const newMessage = {
        time: new Date(),
        from: 'user2',
        to: 'user1',
        type: '0',
        content: 'For Chat Test, New Message',
        status: 'ok',
        read: false,
        chatId: -1
    };
    describe('Add Chat', async () => {
        const oneChat = {
            type: 'private',
            from: 'user1',
            to: 'user2',
            latestMessage: oneMessage
        };
        test('test add chat', async () => {
            const resultObj = (await Chat.insertOne(oneChat)).res;
            const chatId = resultObj.chatId;
            expect(resultObj).toEqual(expect.objectContaining(oneChat));
            const getResult = (await Chat.getByChatId(chatId)).res[0];
            expect(getResult).toEqual(expect.objectContaining(oneChat));
            const updateResult = (await Chat.updateLatestMessage(chatId, newMessage)).res;
            expect(updateResult.latestMessage).toEqual(expect.objectContaining(newMessage));
        });
    });

    describe('Related Chat', async () => {
        const userName = 'testUser';
        const chatList = [];
        for (let i = 0; i < 5; i++) {
            chatList.push({
                type: 'private',
                from: userName,
                to: `user${i}`,
                latestMessage: oneMessage
            });
            await Chat.insertOne(chatList[i]);
        }
        test('test add chat', async () => {
            const related = (await Chat.related(userName)).res;
            expect(related.length).toEqual(chatList.length);
        });
    });
});
