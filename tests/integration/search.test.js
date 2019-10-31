/* eslint-disable no-undef */
const axios = require("axios");
const Message = require("../../model/Message");
const User = require("../../model/User");
const Announcement = require("../../model/Announcement");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_search_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9005;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Search Test", async () => {
    describe("Search Test", async () => {
        const testUser = createUser();
        test("message search with token", async () => {
            const publicMessage = {
                time: new Date(),
                from: testUser.username,
                to: "public",
                type: "public",
                content: "Public Content",
                status: "ok",
                chatId: -1
            };
            for(let i = 0; i < 5; i++) {
                await Message.insertOne(publicMessage);
            }

            const url = `${SERVER_ADDRESS}${API_PREFIX}/search`;
            let res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "about Public a",
                    smallestSearchId: Infinity,
                    pageSize: 3,
                    username: testUser.username,
                    context: "message",
                    type: "public"
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.messages.length).toEqual(3);

            res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "a",
                    smallestSearchId: Infinity,
                    pageSize: 3,
                    username: testUser.username,
                    context: "message",
                    type: "public"
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.messages.length).toEqual(0);
        });

        test("user search with token", async () => {
            const userList = [];
            for(let i = 0; i < 5; i++) {
                userList.push({
                    username: `SearchTest${i}`,
                    password: 1234,
                    avatar: "#ffffff",
                    status: "ok",
                    statusUpdateTime: new Date(),
                    online: false
                });
            }
            for(let i = 0; i < userList.length; i++) {
                await User.addOneUser(userList[i]);
            }

            const url = `${SERVER_ADDRESS}${API_PREFIX}/search`;
            const res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "Search",
                    context: "user",
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.users.length).toEqual(5);
        });

        test("announcement search with token", async () => {
            const oneAnnounce = {
                time: new Date(),
                from: "user1",
                title: "An announcement",
                content: "Announcement content here",
                status: "ok"
            };
            for(let i = 0; i < 5; i++) {
                await Announcement.insertOne(oneAnnounce);
            }

            const url = `${SERVER_ADDRESS}${API_PREFIX}/search`;
            let res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "Announcement",
                    context: "announcement",
                    smallestSearchId: Infinity,
                    pageSize: 3,
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.announcements.length).toEqual(3);

            res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "a",
                    context: "announcement",
                    smallestSearchId: Infinity,
                    pageSize: 3,
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.announcements.length).toEqual(0);

            res = await axios({
                method: "get",
                url: url,
                params: {
                    keywords: "not support",
                    context: "not support",
                    smallestSearchId: Infinity,
                    pageSize: 3,
                },
                headers: {
                    Cookie: "token=" + testUser.token
                },
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);
        });
    });
});
