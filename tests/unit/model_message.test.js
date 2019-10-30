/* eslint-disable no-undef */
process.env.TEST_DB = "test_message";
const Message = require("../../model/Message");

describe("Message DB Test", async () => {
    const oneMessage = {
        time: new Date(),
        from: "test",
        to: "public",
        type: "0",
        content: "Test Content",
        status: "ok",
        read: false,
        chatId: -1
    };
    test("test add message", async () => {
        const temp = await Message.insertOne(oneMessage);
        const resultObj = JSON.parse(JSON.stringify(temp.res));
        resultObj.time = new Date(resultObj.time);
        expect(resultObj).toEqual(expect.objectContaining(oneMessage));
    });
    test("test latest public message", async () => {
        const resultObj = JSON.parse(JSON.stringify((await Message.latestPublic()).res));
        resultObj.time = new Date(resultObj.time);
        expect(resultObj).toEqual(expect.objectContaining(oneMessage));
    });

    const publicMessage = {
        time: new Date(),
        from: "test",
        to: "public",
        type: "0",
        content: "Public Content",
        status: "ok",
        read: false,
        chatId: -1,
        id: 1
    };
    test("test existed search public message", async () => {
        await Message.insertOne(publicMessage);
        const resultObj = (await Message.searchMessage({
            type: "public",
            keywords: "Public",
            smallestMessageId: Infinity,
            pageSize: 10
        })).res;
        expect(resultObj[0].content).toEqual(publicMessage.content);
    });

    const privateMessage = {
        time: new Date(),
        from: "1111",
        to: "2222",
        type: "0",
        content: "Private Content",
        status: "ok",
        read: false,
        chatId: -1
    };
    test("test existed search private message", async () => {
        await Message.insertOne(privateMessage);
        const resultObj = (await Message.searchMessage({
            type: "private",
            keywords: "Private",
            username: "1111",
            smallestMessageId: Infinity,
            pageSize: 10
        })).res;
        expect(resultObj[0].content).toEqual(privateMessage.content);
    });

    test("test default search message", async () => {
        await Message.insertOne(privateMessage);
        const resultObj = (await Message.searchMessage({
            keywords: "Content",
            username: "1111",
            smallestMessageId: Infinity,
            pageSize: 10
        })).res;
        expect(resultObj.length).toBeGreaterThan(1);
    });

    const messageList = [];
    const latestDate = new Date();
    for(let i = 0; i < 5; i++) {
        messageList.push({
            time: latestDate - i * 1000,
            from: "test",
            to: "public",
            type: "0",
            content: `${i} th message`,
            status: "ok",
            read: false,
            chatId: -1
        });
    }
    test("test history message", async () => {
        for(let i = 0; i < messageList.length; i++) {
            await Message.insertOne(messageList[i]);
        }
        const historyMessages = (await Message.history("test", "public", Infinity, 5)).res;
        for(let i = 0; i < messageList.length; i++) {
            expect(historyMessages[i].content).toEqual(`${i} th message`);
        }
    });
});
