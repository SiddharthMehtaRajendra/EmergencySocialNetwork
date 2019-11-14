/* eslint-disable no-undef */
process.env.TEST_DB = "test_user";
const User = require("../../model/User");

describe("User DB Test", async () => {
    const TEST_USERNAME = "test";
    const TEST_PASSWORD = "1234";
    test("test add user", async () => {
        const userObject = {
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: true,
            isDoctor: false
        };
        const addResult = await User.addOneUser(userObject);
        expect(addResult.success).toEqual(true);
        expect(addResult.res.username).toEqual(TEST_USERNAME);
        let validResult = await User.validateCredentials(TEST_USERNAME,TEST_PASSWORD);
        expect(validResult).toEqual(true);
        validResult = await User.validateCredentials(TEST_USERNAME,"FALSE PASS");
        expect(validResult).toEqual(false);
        validResult = await User.validateCredentials("NOT EXIST NAME","FALSE PASS");
        expect(validResult).toEqual(false);
        expect(await User.exists(TEST_USERNAME)).toEqual(true);
        expect(await User.exists("not-exist-user")).toEqual(false);
        const addResult2 = await User.addOneUser(userObject);
        expect(addResult2.success).toEqual(false);
        expect(addResult2.res).toEqual("Username already exist");
    });

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
                online: true,
                isDoctor: false
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

    test("test if is a doctor", async () => {
        const doctor = {
            username: "doctor1",
            password: 1234,
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: true,
            isDoctor: true
        };
        const notdoctor = {
            username: "notdoctor1",
            password: 1234,
            avatar: "#ffffff",
            status: "ok",
            statusUpdateTime: new Date(),
            online: true,
            isDoctor: false
        };
        await User.addOneUser(doctor);
        await User.addOneUser(notdoctor);
        const shouldBeDoctor = await User.isDoctor("doctor1");
        expect(shouldBeDoctor).toEqual(true);
        const shouldNotBeDoctor = await User.isDoctor("notdoctor1");
        expect(shouldNotBeDoctor).toEqual(false);
    });

    test("test add friend into and remove friend from list", async () => {
        const userList = [];
        for(let i = 0; i < 3; i++) {
            userList.push({
                username: `friendtest${i}`,
                password: 1234,
                avatar: "#ffffff",
                status: "ok",
                statusUpdateTime: new Date(),
                online: true,
                isDoctor: false
            });
        }
        for(let i = 0; i < userList.length; i++) {
            await User.addOneUser(userList[i]);
        }
        for(let i = 0; i < userList.length - 1; i++) {
            await User.addIntoAssociatedLists(userList[i].username, userList[i + 1].username);
        }
        const result1 = await User.getOneUserByUsername(userList[1].username);
        const user2 = result1.res[0];
        expect(user2.associatedList.includes(userList[0].username)).toEqual(true);
        for(let i = 0; i < userList.length - 1; i++) {
            await User.removeFromAssociatedLists(userList[i].username, userList[i + 1].username);
        }
        const result2 = await User.getOneUserByUsername(userList[2].username);
        const user3 = result2.res[0];
        expect(user3.associatedList.includes(userList[0].username)).toEqual(false);
    });
});
