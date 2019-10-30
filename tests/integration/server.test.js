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
        test("public message search with token", async () => {
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

    // test("private search with token", async () => {
    //     // insert public
    //     const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
    //     const userObj = {
    //         username: "2222",
    //         password: "1111",
    //         avatar: "red",
    //         status: "ok",
    //         statusUpdateTime: new Date(),
    //         online: true
    //     };
    //     const registerRes = await axios({
    //         method: "post",
    //         url: registerUrl,
    //         data: userObj,
    //         withCredentials: true
    //     });
    //     const token = registerRes.data.token;
    //
    //     const privateMessage = {
    //         time: new Date(),
    //         from: "2222",
    //         to: "1111",
    //         type: "0",
    //         content: "Private Content",
    //         status: "ok",
    //         read: false,
    //         chatId: -1,
    //         id: 1
    //     };
    //     for(let i = 0; i < 3; i++) {
    //         await Message.insertOne(privateMessage);
    //     };
    //
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/privateMessage`;
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "after Private",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.message).toEqual("Get Messages");
    //     expect(res.data.messages.length).toEqual(3);
    //
    //     const overPageRangeRes = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "Private",
    //             smallestMessageId: 9999,
    //             pageSize: 2,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(overPageRangeRes.data.messages.length).toEqual(2);
    // });
    //
    // test("testing null public search content", async () => {
    //     // insert public
    //     const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
    //     const userObj = {
    //         username: "2223",
    //         password: "1111",
    //         avatar: "red",
    //         status: "ok",
    //         statusUpdateTime: new Date(),
    //         online: true
    //     };
    //     const registerRes = await axios({
    //         method: "post",
    //         url: registerUrl,
    //         data: userObj,
    //         withCredentials: true
    //     });
    //     const token = registerRes.data.token;
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/publicMessage`;
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.success).toEqual(false);
    // });
    //
    // test("testing null public search content", async () => {
    //     // insert public
    //     const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
    //     const userObj = {
    //         username: "2223",
    //         password: "1111",
    //         avatar: "red",
    //         status: "ok",
    //         statusUpdateTime: new Date(),
    //         online: true
    //     };
    //     const registerRes = await axios({
    //         method: "post",
    //         url: registerUrl,
    //         data: userObj,
    //         withCredentials: true
    //     });
    //     const token = registerRes.data.token;
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/publicMessage`;
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.success).toEqual(false);
    // });
    //
    // test("testing null private search content", async () => {
    //     // insert public
    //     const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
    //     const userObj = {
    //         username: "2223",
    //         password: "1111",
    //         avatar: "red",
    //         status: "ok",
    //         statusUpdateTime: new Date(),
    //         online: true
    //     };
    //     const registerRes = await axios({
    //         method: "post",
    //         url: registerUrl,
    //         data: userObj,
    //         withCredentials: true
    //     });
    //     const token = registerRes.data.token;
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/privateMessage`;
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.success).toEqual(false);
    // });
    //
    // test("testing invalid search contextual", async () => {
    //     // insert public
    //     const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
    //     const userObj = {
    //         username: "2224",
    //         password: "1111",
    //         avatar: "red",
    //         status: "ok",
    //         statusUpdateTime: new Date(),
    //         online: true
    //     };
    //     const registerRes = await axios({
    //         method: "post",
    //         url: registerUrl,
    //         data: userObj,
    //         withCredentials: true
    //     });
    //     const token = registerRes.data.token;
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/invalidContextual`;
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "Private",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         headers: {
    //             Cookie: "token=" + token
    //             // Cookie: "textwrapon=false; textautoformat=false; wysiwyg=textarea; connect.sid=s%3AdRK0v9f1gOn51BG5FS1iXIZ1LHW8nmaL.tYCGaphqYFI%2B1v84ZW83vPaddB0uOTj8JTcnJ3qgq3w; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzIxMjcxMzUsImV4cCI6MTU3MjIxMzUzNX0.G17TDFHhUZuI2BuVh1G5tsZJYXXr7zAHZWcw-mEPh0U; io=ogAtvh81AN9X4FIgAAAE"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.success).toEqual(false);
    //     expect(res.data.message).toEqual("Load Messages Failed");
    // });
    //
    // test("search without token", async () => {
    //     const url = `${SERVER_ADDRESS}${API_PREFIX}/search/publicMessage`;
    //     console.log(url);
    //     const res = await axios({
    //         method: "post",
    //         url: url,
    //         data: {
    //             searchMessage: "public",
    //             smallestMessageId: 9999,
    //             pageSize: 10,
    //             username: "1111"
    //         },
    //         withCredentials: true
    //     });
    //     expect(res.status).toEqual(200);
    //     expect(res.data.message).toEqual("No token recieved");
    // });
});
