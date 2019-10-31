const Announcement = require("../../model/Announcement");

const processAnnouncement = function (announcement) {
    return {
        time: new Date(),
        from: announcement.from,
        title: announcement.title || "No Title",
        content: announcement.content,
        status: announcement.status
    };
};

const postAnnouncement = async function (req, io) {
    try {
        const announcement = processAnnouncement(req.body.announcement);
        const dbResult = await Announcement.insertOne(announcement);
        io.emit("UPDATE_ANNOUNCEMENT", dbResult.res);
        return {
            success: true,
            message: "Post announcement success",
            announcement: dbResult.res
        };
    } catch (e) {
        /* istanbul ignore next */
        return {
            success: false,
            message: "Post announcement failed"
        };
    }
};

module.exports = postAnnouncement;
