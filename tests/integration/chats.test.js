/* eslint-disable no-undef */
const uuid = require("uuid");

process.env.SERVER_TEST_DB = "server_chats_test";

const API_PREFIX = "/api";
let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9002;
    SERVER_ADDRESS = "http://localhost:9002";
}

require("../../server/index");
const axios = require("axios");

const genUserName = function(){
    return uuid.v1().toString().replace(/-/g,"");
};

describe("API Chats Test", async () => {
    test("Chats Test", async () => {
        const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
        const USER_NAME = genUserName();
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
        expect(res.data.chats.length).toEqual(0);
    });
});
