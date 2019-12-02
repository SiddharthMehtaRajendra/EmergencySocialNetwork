/* eslint-disable no-undef */
const axios = require("axios");
const Chat = require("../../model/Chat");
const Announcement = require("../../model/Announcement");
const Message = require("../../model/Message");
const Info = require("../../model/Info");
const { createUser } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_info_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9110;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Update Profile Test", async () => {
    const testUser = createUser();
    const newObject = {
        oldUsername: testUser.username,
        newUsername: "2222"
    };
    test("update username", async () => {
        // await User.addOneUser(userObject);
        const url = `${SERVER_ADDRESS}${API_PREFIX}/updateUsername`;
        const res = await axios({
            method: "post",
            url: url,
            data: {params : newObject},
            headers: {
                Cookie: "token=" + testUser.token
            },
            withCredentials: true
        });
        expect(res.data.success).toEqual(true);
    });

});
