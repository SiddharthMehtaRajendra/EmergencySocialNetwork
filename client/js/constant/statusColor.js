const STATUS = require("./status");
const STATUS_COLOR = {
    EMERGENCY: {
        HEX: "#F41C3B",
        RGB: [244, 28, 59]
    },
    OK: {
        HEX: "#7ED321",
        RGB: [126, 211, 33]
    },
    HELP: {
        HEX: "#FFCC00",
        RGB: [255, 204, 0]
    },
    NEED_HELP: {
        HEX: "#FFCC00",
        RGB: [255, 204, 0]
    },
    NO_STATUS: {
        HEX: "#999999",
        RGB: [153, 153, 153]
    },
    PRIMARY: {
        HEX: "#1983FF",
        RGB: [25, 131, 255]
    }
};

const getStatusColor = function (status, isMe, hex) {
    let color = "";
    status = status.toLowerCase();
    if(isMe) {
        if(status === STATUS.EMERGENCY) {
            color = STATUS_COLOR.EMERGENCY;
        } else {
            color = STATUS_COLOR.PRIMARY;
        }
    } else {
        switch (status) {
        case STATUS.EMERGENCY:
            color = STATUS_COLOR.EMERGENCY;
            break;
        case STATUS.HELP:
        case STATUS.NEED_HELP:
            color = STATUS_COLOR.NEED_HELP;
            break;
        case STATUS.NO_STATUS:
            color = STATUS_COLOR.NO_STATUS;
            break;
        case STATUS.OK:
            color = STATUS_COLOR.OK;
            break;
        default:
            color = STATUS_COLOR.NO_STATUS;
            break;
        }
    }
    if(hex) {
        return color.HEX;
    } else {
        return color.RGB;
    }
};

module.exports = {
    STATUS_COLOR,
    getStatusColor
};
