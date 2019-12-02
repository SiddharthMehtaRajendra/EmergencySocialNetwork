/* eslint-disable no-undef */
const axios = require("axios");
const User = require("../../model/User");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_info_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9100;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Update Profile Test", async () => {
    const testUser = createUser();
    const profileObject = {
        oldUsername: testUser.username,
        newUsername: "2222",
        password: "1234",
        privilege: "administer",
        adminStatus: "active"
    };
    test("no existed user", async () => {
        // await User.addOneUser(userObject);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateProfile/`;
        const res = await axios({
            method: "post",
            url: url,
            data: {params : profileObject},
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });
    test("username stays same", async () => {
        // await User.addOneUser(userObject);
        profileObject.newUsername = profileObject.oldUsername;
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateProfile/`;
        const res = await axios({
            method: "post",
            url: url,
            data: {params : profileObject},
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });
    test("username existed", async () => {
        const newUser = createUser();
        const userObject = {
            username: newUser.username,
            password: "1234",
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: false,
            isDoctor: false
        };
        await User.addOneUser(userObject);
        profileObject.newUsername = userObject.username;
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateProfile/`;
        const res = await axios({
            method: "post",
            url: url,
            data: {params : profileObject},
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.err).toEqual("username exsiteed");
    });
    /*
    test("update information fails", async () => {
        // console.log(updateRes);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateinformation`;
        const res = await axios({
            method: "post",
            url: url,
            data: {params : infoObject},
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        // console.log(res.data);
        expect(res.data.success).toEqual(true);
    });
    test("get existed user info", async () => {
        // console.log(updateRes);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/info/` + testUser.username;
        const res = await axios({
            method: "get",
            url: url,
            data: infoObject,
            headers: {
                Cookie: "token=" + testUser.token
            },
        });
        expect(res.data.success).toEqual(true);
        expect(res.data.info.username).toEqual(testUser.username);
    });
    */

});
