/* eslint-disable no-undef */
const axios = require("axios");
const Info = require("../../model/Info");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_info_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9026;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Info Test", async () => {
    const testUser = createUser();
    const infoObject = {
        username: testUser.username,
        name: "2222",
        phoneNumber: "123",
        address: "2",
        contactNumber: "3",
        selfIntro: "hi",
        shareList: ["test1","test2"]
    };
    test("no existed user", async () => {
        // await User.addOneUser(userObject);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/info/` + testUser.username;
        const res = await axios({
            method: "get",
            url: url,
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(false);
    });
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

});
