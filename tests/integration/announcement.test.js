/* eslint-disable no-undef */
const axios = require("axios");
const { genUserName } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_announcement_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9001;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Announcement Test", async () => {
    test("Announcement Test", async () => {
        const registerUrl = `${SERVER_ADDRESS}${API_PREFIX}/join`;
        const USER_NAME = genUserName();
        const userForTest = {
            username: USER_NAME,
            password: "1234",
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: true,
            isDoctor: false
        };
        const registerRes = await axios({
            method: "post",
            url: registerUrl,
            data: userForTest,
            withCredentials: true
        });
        const token = registerRes.data.token;
        let res = await axios({
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

        res = await axios({
            method: "post",
            url: `${SERVER_ADDRESS}${API_PREFIX}/postAnnouncement/`,
            data: {
                announcement: {
                    title: "",
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
        expect(res.data.announcement.title).toEqual("No Title");

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
        expect(res2.data.announcements.length).toEqual(2);
    });
});
