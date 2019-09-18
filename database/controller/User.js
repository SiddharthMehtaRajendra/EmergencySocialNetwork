const User = require('../model/User');

async function addUser(userObject) {
    const userDoc = new User(userObject);
    let res = {};
    let success = true;
    try {
        res = await userDoc.save();
    } catch (e) {
        res = e._message;
        success = false;
    }
    return { success, res };
}

module.exports = { addUser };
