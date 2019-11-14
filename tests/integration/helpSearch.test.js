/* eslint-disable no-undef */
const axios = require("axios");
const { genUserName } = require("../lib/mockUser");
const API_PREFIX = "/api";

process.env.SERVER_TEST_DB = "server_helpsearch_test";

let SERVER_ADDRESS = "";
if(!process.env.PORT) {
    process.env.PORT = 9003;
    SERVER_ADDRESS = `http://localhost:${process.env.PORT}`;
}

require("../../server/index");

describe("Server Help Search Test", async () => {
    test("Help Search Test", async () => {
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

        const responseOne = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/helpSearch`, {
            params: {
                keywords: "hospital"
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(responseOne.data.results.length).toBeGreaterThan(1);

        let resOne = await axios({
            method: "post",
            url: `${SERVER_ADDRESS}${API_PREFIX}/saveHelpCenter/`,
            data: {
                params: {
                    helpCenterName: "ABCD",
                    helpCenterAddress: "1234 CA, USA",
                    username: USER_NAME
                }
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(resOne.data).toEqual(true);

        const responseTwo = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/preferredHelpCenters`, {
            params: {
                username: USER_NAME,
                helpCenterName: "ABCD"
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(responseTwo.data.results.length).toEqual(1);

        let resTwo = await axios({
            method: "post",
            url: `${SERVER_ADDRESS}${API_PREFIX}/uploadMedicalId/`,
            data: {
                params: {
                    username: USER_NAME,
                    helpCenterName: "ABCD"
                }
            },
            headers: {
                Cookie: "token=" + token
            },
            withCredentials: true
        });
        expect(resTwo.data).toEqual(true);
    });
});
