const Message = require("../../model/Message");

const historyMessage = async function (req, res, next) {
    const smallestMessageId = +(req.query && req.query.smallestMessageId);
    const pageSize = +(req.query && req.query.pageSize);
    const from = (req.query && req.query.from);
    const to = (req.query && req.query.to);
    const dbResult = await Message.history(from, to, +smallestMessageId, pageSize);
    if(dbResult.success) {
        res.status(200).json({
            success: true,
            message: "Get Messages",
            messages: dbResult.res
        });
    } else {
        res.status(200).json({
            success: false,
            message: "Load Messages Failed"
        });
    }
};

module.exports = historyMessage;
