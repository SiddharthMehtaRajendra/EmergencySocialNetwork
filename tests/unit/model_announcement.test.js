/* eslint-disable no-undef */
process.env.TEST_DB = "test_announcement";
const Announcement = require("../../model/Announcement");

describe("Announcement DB Test", async () => {
    const oneAnnounce = {
        time: new Date(),
        from: "user1",
        title: "An announcement",
        content: "Announcement content here",
        status: "ok"
    };
    test("test add announcement", async () => {
        const resultObj = (await Announcement.insertOne(oneAnnounce)).res;
        expect(resultObj).toEqual(expect.objectContaining(oneAnnounce));
    });

    test("Test History Announcements", async () => {
        for(let i = 0; i < 5; i++) {
            await Announcement.insertOne(oneAnnounce);
        }
        const historyAnnouncements = (await Announcement.announcementHistory(Infinity, 5)).res;
        expect(historyAnnouncements.length).toEqual(5);
    });
});
