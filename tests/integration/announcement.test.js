/* eslint-disable no-undef */
const uuid = require("uuid");

process.env.SERVER_TEST_DB = "server_announcement_test";

const API_PREFIX = "/api";
let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9001;
    SERVER_ADDRESS = "http://localhost:9001";
}

require("../../server/index");
const axios = require("axios");

const genUserName = function(){
    return uuid.v1().toString().replace(/-/g,"");
};

describe("API Announcement Test", async () => {
    test("Announcement Test", async () => {
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
            method: "post",
            url: `${SERVER_ADDRESS}${API_PREFIX}/postAnnouncement/`,
            data: {
                announcement: {
                    title: "Title",
                    content: "Content Here",
                    status: "ok",
                    from: USER_NAME
                }
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(res.data.announcement.title).toEqual("Title");

        const res2 = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/announcement`, {
            params: {
                smallestAnnouncementId: Infinity,
                pageSize: 10
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(res2.data.announcements[0].title).toEqual("Title");
    });
});
