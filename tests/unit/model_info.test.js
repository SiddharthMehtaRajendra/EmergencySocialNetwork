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
    /*
    test("test update attribute", async () => {
        await User.updateStatus(TEST_USERNAME, "help");
        let updated = await User.getOneUserByUsername(TEST_USERNAME);
        expect(updated.res[0].status).toEqual("help");
        await User.updateOnline(TEST_USERNAME, true);
        updated = await User.getOneUserByUsername(TEST_USERNAME);
        expect(updated.res[0].online).toEqual(true);
        await User.updateSocketId(TEST_USERNAME, "TEST SOCKET ID");
        updated = await User.getOneUserByUsername(TEST_USERNAME);
        expect(updated.res[0].socketID).toEqual("TEST SOCKET ID");
    });

    test("test get user list", async () => {
        const userList = [];
        for(let i = 0; i < 5; i++) {
            userList.push({
                username: `searchtest${i}`,
                password: 1234,
                avatar: "#ffffff",
                status: "ok",
                statusUpdateTime: new Date(),
                online: true
            });
        }
        for(let i = 0; i < userList.length; i++) {
            await User.addOneUser(userList[i]);
        }
        const userSearchedResult = (await User.searchUser("search")).res;
        expect(userSearchedResult.length).toEqual(5);
        const allUsers = await User.getAllUsers();
        expect(allUsers.res.length).toBeGreaterThan(5);
    });
    */
});
