const buildRes = function(success,message,obj) {
    return Object.assign({
        message: message,
        success: success
    },obj);
};

module.exports = buildRes;
