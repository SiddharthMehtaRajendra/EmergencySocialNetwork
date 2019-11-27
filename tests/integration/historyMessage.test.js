/* eslint-disable no-undef */
const axios = require("axios");
const Message = require("../../model/Message");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_history_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9004;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server History Message Test", async () => {
    test("History Message Test", async () => {
        const testUser = createUser();
        let messageList = [];
        const latestDate = new Date();
        for(let i = 0; i < 5; i++) {
            messageList.push({
                time: latestDate - i * 1000,
                from: testUser.username,
                to: "public",
                type: "0",
                content: `${i} th message`,
                status: "ok",
                chatId: -1
            });
        }
        for(let i = 0; i < messageList.length; i++) {
            await Message.insertOne(messageList[i]);
        }
        let res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/historyMessage`, {
            params: {
                smallestMessageId: Infinity,
                pageSize: 10,
                from: testUser.username,
                to: "public"
            },
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.messages.length).toEqual(5);

        messageList = [];
        for(let i = 0; i < 5; i++) {
            messageList.push({
                time: latestDate - i * 1000,
                from: testUser.username,
                to: "user2",
                type: "0",
                content: `${i} th message`,
                status: "ok",
                chatId: -1
            });
        }
        for(let i = 0; i < messageList.length; i++) {
            await Message.insertOne(messageList[i]);
        }
        res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/historyMessage`, {
            params: {
                smallestMessageId: Infinity,
                pageSize: 10,
                from: testUser.username,
                to: "user2"
            },
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.messages.length).toEqual(5);
    });
});
