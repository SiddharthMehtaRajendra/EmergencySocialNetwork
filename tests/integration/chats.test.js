/* eslint-disable no-undef */
const axios = require("axios");
const Chat = require("../../model/Chat");
const { genUserName } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_chats_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9002;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Chats Test", async () => {
    test("Chats Test", async () => {
        const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
        const USER_NAME = genUserName();
        const oneMessage = {
            time: new Date(),
            from: USER_NAME,
            to: "user2",
            type: "0",
            content: "For Chat Test",
            status: "ok",
            read: false,
            chatId: -1
        };
        const oneChat = {
            type: "private",
            from: USER_NAME,
            to: "user2",
            latestMessage: oneMessage
        };
        const anotherChat = {
            type: "private",
            from: "user3",
            to: USER_NAME,
            latestMessage: oneMessage
        };

        await Chat.insertOne(oneChat);
        await Chat.insertOne(anotherChat);

        const userForTest = {
            username: USER_NAME,
            password: "1234",
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: true
        };
        const registerRes = await axios({
            method: "post",
            url: registerUrl,
            data: userForTest,
            withCredentials: true
        });
        const token = registerRes.data.token;
        const res = await axios({
            method: "get",
            url: `${SERVER_ADDRESS}${API_PREFIX}/chats/`,
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(res.data.public.chatId).toEqual(-1);
        expect(res.data.chats.length).toEqual(2);
    });
});
