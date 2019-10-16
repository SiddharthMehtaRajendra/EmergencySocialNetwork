/* eslint-disable no-undef */
const Message = require('../../database/model/Message');

describe('Message DB Test', () => {
    describe('Add Message', async () => {
        const oneMessage = {
            time: new Date(),
            from: 'test',
            to: 'public',
            type: '0',
            content: 'Test Content',
            status: 'ok',
            read: false,
            chatId: -1
        };
        test('test add message', async () => {
            const temp = await Message.insertOne(oneMessage);
            const resultObj = JSON.parse(JSON.stringify(temp.res));
            resultObj.time = new Date(resultObj.time);
            expect(resultObj).toEqual(expect.objectContaining(oneMessage));
        });
    });
    describe('Latest Public Message', async () => {
        const oneMessage = {
            time: new Date(),
            from: 'test',
            to: 'public',
            type: '0',
            content: 'In history message test',
            status: 'ok',
            read: false,
            chatId: -1
        };
        test('test latest public message', async () => {
            await Message.insertOne(oneMessage);
            const resultObj = JSON.parse(JSON.stringify((await Message.latestPublic()).res));
            resultObj.time = new Date(resultObj.time);
            expect(resultObj).toEqual(expect.objectContaining(oneMessage));
        });
    });
    describe('History Message', async () => {
        const messageList = [];
        const latestDate = new Date();
        for (let i = 0; i < 10; i++) {
            messageList.push({
                time: latestDate - i * 1000,
                from: 'test',
                to: 'public',
                type: '0',
                content: `${i} th message`,
                status: 'ok',
                read: false,
                chatId: -1
            });
        }
        test('test history message', async () => {
            for (let i = 0; i < messageList.length; i++) {
                await Message.insertOne(messageList[i]);
            }
            const historyMessages = (await Message.history('test', 'public', Infinity, 10)).res;
            for (let i = 0; i < historyMessages.length; i++) {
                expect(historyMessages[i].content).toEqual(`${i} th message`);
            }
        });
    });
});
