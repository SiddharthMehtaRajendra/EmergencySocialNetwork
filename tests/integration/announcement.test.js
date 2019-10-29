/* eslint-disable no-undef */
process.env.TEST_DB = "test_announcement";
const Announcement = require('../../model/Announcement')

describe("Post Announcement Test", async () => {

    const announcement = {
        time: new Date(),
        from: "Test",
        title: "Test Announcement",
        content: "Is the test working!",
        status: "OK"
    }

    test("Test Insert Announcement", async () => {
        const temp = await Announcement.insertOne(announcement);
        const resultObj = JSON.parse(JSON.stringify(temp.res));
        resultObj.time = new Date(resultObj.time);
        expect(resultObj).toEqual(expect.objectContaining(announcement));
    });

    const announcementList = [];
    const latestDate = new Date();
    for(let i = 0; i < 5; i++) {
        announcementList.push({
            time: latestDate - i * 1000,
            from: 'TestList',
            title: `TestList-Announcement-${i}`,
            content: `${i} th TestList Announcement`,
            status: "OK"
        });
    }

    test("Test History Announcements", async () => {
        for(let i = 0; i < announcementList.length; i++) {
            await Announcement.insertOne(announcementList[i]);
        }
        const historyAnnouncements = (await Announcement.searchAnnouncements("TestList", "TestList", Infinity, 5)).res;
        for(let i = 0; i < announcementList.length; i++) {
            expect(historyAnnouncements[announcementList.length - 1 - i].content).toEqual(`${i} th TestList Announcement`);
        }
    });

    const existingAnnouncement = {
        time: new Date(),
        from: "Test",
        title: "Existing Announcement",
        content: "Test Existing Announcement!",
        status: "OK"
    }

    test("Test Search Existing Announcement", async () => {
        await Announcement.insertOne(existingAnnouncement);
        const resultObj = JSON.parse(JSON.stringify((await Announcement.searchAnnouncements("Existing", "Existing", Infinity, 10)).res));
        existingAnnouncement.announcement_id = resultObj[0].announcement_id;
        resultObj[0].time = new Date(resultObj[0].time);
        expect(resultObj[0]).toEqual(expect.objectContaining(existingAnnouncement));
    });

    test("Test Search Non-Existing Announcement", async () => {
        const resultObj = JSON.parse(JSON.stringify(await Announcement.searchAnnouncements("Non-Existing", "Non-Existing", Infinity, 10)));
        expect(resultObj.res.length).toEqual(0);
    });
});
