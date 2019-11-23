/* eslint-disable no-undef */
const axios = require("axios");
const { genUserName } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_join_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9005;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Join Test", async () => {
    describe("Heartbeat", async () => {
        test("Heartbeat", async () => {
            const url = `${SERVER_ADDRESS}/heartbeat`;
            const res = await axios({
                method: "get",
                url: url
            });
            expect(res.data.success).toEqual(true);
        });
    });

    describe("Join Test", async () => {
        const username = genUserName();
        const password = "1234";
        test("Join", async () => {
            const url = `${SERVER_ADDRESS}${API_PREFIX}/join`;
            const userObj = {
                username: username,
                password: password,
                avatar: "#ffffff",
                status: "ok",
                statusUpdateTime: new Date(),
                online: true,
                isDoctor: false
            };
            let res = await axios({
                method: "post",
                url: url,
                data: userObj,
                withCredentials: true
            });
            expect(res.data.success).toEqual(true);

            res = await axios({
                method: "post",
                url: url,
                data: userObj,
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);

            userObj.username = "12";
            res = await axios({
                method: "post",
                url: url,
                data: userObj,
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);
        });

        test("Join Check", async () => {
            const url = `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`;
            let res = await axios({
                method: "post",
                url: url,
                data: {
                    username: username,
                    password: "not1234"
                },
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);
            expect(res.data.validationPass).toEqual(false);

            res = await axios({
                method: "post",
                url: url,
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true
            });
            expect(res.data.success).toEqual(true);
            expect(res.data.validationPass).toEqual(true);

            res = await axios({
                method: "post",
                url: url,
                data: {
                    username: "AUser",
                    password: "1234"
                },
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);
            expect(res.data.exists).toEqual(false);

            res = await axios({
                method: "post",
                url: url,
                data: {
                    username: "aa",
                    password: "1234"
                },
                withCredentials: true
            });
            expect(res.data.success).toEqual(false);
            expect(res.data.validationPass).toEqual(false);
        });
    });
});
