const Announcement = require("../../model/Announcement");

const announcement = async function (req, res, next) {
    const smallestAnnouncementId = +(req.query && req.query.smallestAnnouncementId);
    const pageSize = +(req.query && req.query.pageSize);
    const dbResult = await Announcement.announcementHistory(+smallestAnnouncementId, pageSize);
    if(dbResult.success) {
        res.status(200).json({
            success: true,
            message: "Get Announcements",
            announcements: dbResult.res
        });
    } else {
        res.status(200).json({
            success: false,
            message: "Get Announcements Failed"
        });
    }
};

module.exports = announcement;
