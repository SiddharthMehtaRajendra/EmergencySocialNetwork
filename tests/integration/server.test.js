/* eslint-disable no-undef */

process.env.SERVER_TEST_DB = "server_test";
const Message = require("../../model/Message");

const API_PREFIX = "/api";
let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9000;
    SERVER_ADDRESS = "http://localhost:9000";
}

require("../../server/index");
const axios = require("axios");

describe("Server Test", async () => {
    describe("Join Test", async () => {
        test("Heartbeat", async () => {
            const url = `${SERVER_ADDRESS}/heartbeat`;
            const res = await axios({
                method: "get",
                url: url
            });
            expect(res.data.success).toEqual(true);
        });

        test("Join Check", async () => {
            const url = `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`;
            const res = await axios({
                method: "post",
                url: url,
                data: {
                    username: "AUser",
                    password: "1234"
                },
                withCredentials: true
            });
            expect(res.status).toEqual(200);
            expect(res.data.success).toEqual(false);
            expect(res.data.exists).toEqual(false);
        });

        test("Join", async () => {
            const url = `${SERVER_ADDRESS}${API_PREFIX}/join`;
            const userObj = {
                username: "joinTest",
                password: "joinTest",
                avatar: "#ffffff",
                status: "ok",
                statusUpdateTime: new Date(),
                online: true
            };
            const res = await axios({
                method: "post",
                url: url,
                data: userObj,
                withCredentials: true
            });
            expect(res.data.success).toEqual(true);
        });
    });

    describe("Search Test",async () => {
        test("message search with token", async () => {
            const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
            const userObj = {
                username: "1111",
                password: "1111",
                avatar: "#ffffff",
                status: "ok",
                statusUpdateTime: new Date(),
                online: true
            };
            const registerRes = await axios({
                method: "post",
                url: registerUrl,
                data: userObj,
                withCredentials: true
            });
            const token = registerRes.data.token;
            const publicMessage = {
                time: new Date(),
                from: "1111",
                to: "public",
                type: "public",
                content: "Public Content",
                status: "ok",
                chatId: -1
            };
            for(let i = 0; i < 3; i++) {
                await Message.insertOne(publicMessage);
            }

            const url = `${SERVER_ADDRESS}${API_PREFIX}/search`;
            const res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "about Public a",
                    smallestSearchId: Infinity,
                    pageSize: 10,
                    username: "1111",
                    context: "message",
                    type: "public"
                },
                headers: {
                    Cookie: "token=" + token
                },
                withCredentials: true
            });
            expect(res.status).toEqual(200);
            expect(res.data.messages.length).toEqual(3);
        });
    });
});
