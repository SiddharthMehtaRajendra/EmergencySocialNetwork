const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AnnouncementSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
    from: {
        type: String
    },
    content: {
        type: String
    },
    status: {
        type: String
    }
});

AnnouncementSchema.statics.insertOne = async function (announcement) {
    let res = {};
    let success = true;
    announcement.time = new Date();
    try {
        res = await this.create(announcement);
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

AnnouncementSchema.statics.announcementHistory = async function (smallestAnnouncementId, pageSize) {
    let res = [];
    let success = true;
    try {
        res = await this.find({
            announcement_id: { $lt: + smallestAnnouncementId }
        }).sort({ announcement_id: -1 }).limit(pageSize);
        res = res.reverse();
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

AnnouncementSchema.statics.searchAnnouncements = async function (searchContent, smallestAnnouncementId, pageSize) {
    let res = [];
    let success = true;
    try {
        res = await this.find({
            content: { $regex: searchContent },
            announcement_id: { $lt: + smallestAnnouncementId }
        }).sort({ announcement_id: -1 }).limit(pageSize + 1);
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

AnnouncementSchema.plugin(AutoIncrement, { inc_field: "announcement_id" });

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

module.exports = Announcement;
