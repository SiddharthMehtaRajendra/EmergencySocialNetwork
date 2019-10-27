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
        const resultObj = JSON.parse(JSON.stringify((await Message.searchPublicMessage("Public", 9999, 10)).res));
        resultObj[0].time = new Date(resultObj[0].time);
        publicMessage.id = resultObj[0].id;
        expect(resultObj[0]).toEqual(expect.objectContaining(publicMessage));
    });
    test("test non-existed search public message", async () => {
        const resultObj = await Message.searchPublicMessage("non-existed", 9999, 10);
        expect(resultObj.res.length).toEqual(0);
    });
    /*
    test("test invalid search of public message", async () => {
        const resultObj = await Message.searchPublicMessage("Public", "123", 10);
        expect(resultObj).toEqual(true);
    });
    */

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
        const resultObj = JSON.parse(JSON.stringify((await Message.searchPrivateMessage("1111", "Private", 9999, 10)).res));
        privateMessage.id = resultObj[0].id;
        resultObj[0].time = new Date(resultObj[0].time);
        expect(resultObj[0]).toEqual(expect.objectContaining(privateMessage));
    });
    test("test non-existed search private message", async () => {
        const resultObj = await Message.searchPrivateMessage("public", 9999, 10);
        expect(resultObj.res.length).toEqual(0);
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
