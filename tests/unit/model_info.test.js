/* eslint-disable no-undef */
process.env.TEST_DB = "test_info";
const Info = require("../../model/Info");

describe("Info DB Test", async () => {
    const TEST_USERNAME = "test";
    const TEST_PASSWORD = "1234";
    test("Create Info", async () => {
        const userObject = {
            username: TEST_USERNAME,
            name: "1111",
            phoneNumber: "123",
            address: "2",
            contactNumber: "3",
            selfIntro: "hi",
            shareList: ["test1","test2"]
        };
        const updateResult = await Info.updateInformation(userObject);
        expect(updateResult.success).toEqual(true);
        expect(updateResult.res.username).toEqual(TEST_USERNAME);
    });
    test("Update Info", async () => {
        const infoObject = {
            username: TEST_USERNAME,
            name: "1111",
            phoneNumber: "123",
            address: "2",
            contactNumber: "3",
            selfIntro: "hi",
            shareList: ["test1","test2"]
        };
        await Info.updateInformation(infoObject);
        const newInfoObject = {
            username: TEST_USERNAME,
            name: "2222",
            phoneNumber: "123",
            address: "2",
            contactNumber: "3",
            selfIntro: "hi",
            shareList: ["test1","test2"]
        };
        const updateResult = await Info.updateInformation(newInfoObject);
        expect(updateResult.success).toEqual(true);
        expect(updateResult.res.name).toEqual("2222");
    });
});
