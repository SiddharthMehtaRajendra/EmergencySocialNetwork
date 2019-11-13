/* eslint-disable no-undef */
const axios = require("axios");
const User = require("../../model/User");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_users_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9006;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Users Test", async () => {
    const testUser = createUser();
    const userObject = {
        username: testUser.username,
        password: "1234",
        avatar: "#ffffff",
        status: "ok",
        statusUpdateTime: new Date(),
        online: false
    };
    test("update status test", async () => {
        await User.addOneUser(userObject);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateStatus`;
        const res = await axios({
            method: "post",
            url: url,
            data: {
                username: testUser.username,
                status: "emergency"
            },
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });
    test("get one user info test", async () => {
        let res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user`, {
            params: {
                username: testUser.username
            },
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.user.username).toEqual(testUser.username);

        res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/notExistName`, {
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.user.username).toEqual(null);
    });

    test("get users info test", async () => {
        const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`, {
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.users.length).toEqual(1);
    });

    test("update user's location", async () => {
        let res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
            location: {
                latitude: 0,
                longitude: 0
            },
            sharingLocationOpen: true
        }, {
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
        res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/updateLocation`, {
            location: {
                latitude: 0,
                longitude: 0
            },
            sharingLocationOpen: true
        });
        expect(res.data.success).toEqual(false);
    });
});
