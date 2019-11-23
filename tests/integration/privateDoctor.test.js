/* eslint-disable no-undef */
const axios = require("axios");
const User = require("../../model/User");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_private_doctor_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9007;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Add/Remove Private Doctor Test", async () => {
    const testUser1 = createUser();
    const testUser2 = createUser();
    const userObject1 = {
        username: testUser1.username,
        password: "1234",
        avatar: "#ffffff",
        status: "ok",
        statusUpdateTime: new Date(),
        online: false,
        isDoctor: false,
        // associatedList: [testUser2.username]
    };
    const userObject2 = {
        username: testUser1.username,
        password: "1234",
        avatar: "#ffffff",
        status: "ok",
        statusUpdateTime: new Date(),
        online: false,
        isDoctor: true,
        // associatedList: [testUser1.username]
    };
    test("remove private doctor test without value", async () => {
        await User.addOneUser(userObject1);
        await User.addOneUser(userObject2);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/removePrivateDoctor`;
        const res = await axios({
            method: "post",
            url: url,
            data: {
                username1: testUser1.username,
                username2: testUser2.username,
            },
            headers: {
                Cookie: "token=" + testUser1.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(false);
    });
    test("add private doctor test", async () => {
        // await User.addOneUser(userObject1);
        // await User.addOneUser(userObject2);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/addPrivateDoctor`;
        const res = await axios({
            method: "post",
            url: url,
            data: {
                username1: testUser1.username,
                username2: testUser2.username,
            },
            headers: {
                Cookie: "token=" + testUser1.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(false);
    });
    const testUser3 = createUser();
    const testUser4 = createUser();
    const userObject3 = {
        username: testUser3.username,
        password: "1234",
        avatar: "#ffffff",
        status: "ok",
        statusUpdateTime: new Date(),
        online: false,
        isDoctor: false,
        associatedList: [testUser4.username]
    };

    const userObject4 = {
        username: testUser4.username,
        password: "1234",
        avatar: "#ffffff",
        status: "ok",
        statusUpdateTime: new Date(),
        online: false,
        isDoctor: true,
        associatedList: [testUser3.username]
    };
    test("remove private doctor test with value", async () => {
        await User.addOneUser(userObject3);
        await User.addOneUser(userObject4);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/removePrivateDoctor`;
        const res = await axios({
            method: "post",
            url: url,
            data: {
                username1: testUser3.username,
                username2: testUser4.username,
            },
            headers: {
                Cookie: "token=" + testUser3.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });
    test("add private doctor test 2", async () => {
        // await User.addOneUser(userObject1);
        // await User.addOneUser(userObject2);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/addPrivateDoctor`;
        const res = await axios({
            method: "post",
            url: url,
            data: {
                username1: testUser3.username,
                username2: testUser4.username,
            },
            headers: {
                Cookie: "token=" + testUser1.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });
});
