const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/* istanbul ignore next */
const AnnouncementSchema = new mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
    from: {
        type: String
    },
    title: {
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
    try {
        res = await this.create(announcement);
    } catch (e) {
        /* istanbul ignore next */
        res = e._message;
        /* istanbul ignore next */
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
            announcementId: { $lt: +smallestAnnouncementId }
        }).sort({ announcementId: -1 }).limit(pageSize);
    } catch (e) {
        /* istanbul ignore next */
        res = e._message;
        /* istanbul ignore next */
        success = false;
    }
    return {
        success,
        res
    };
};

AnnouncementSchema.statics.searchAnnouncement = async function (params) {
    let res = [];
    let success = true;
    try {
        res = await this.find({
            $or: [{
                title: {$regex: params.keywords }
            }, {
                content: { $regex: params.keywords }
            }],
            announcementId: { $lt: +params.smallestAnnouncementId }
        }).sort({ announcementId: -1 }).limit(params.pageSize + 1);
    } catch (e) {
        /* istanbul ignore next */
        res = e._message;
        /* istanbul ignore next */
        success = false;
    }
    return {
        success,
        res
    };
};

AnnouncementSchema.plugin(AutoIncrement, { inc_field: "announcementId" });

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

module.exports = Announcement;
