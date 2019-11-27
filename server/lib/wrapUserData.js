const wrapOne = function (user) {
    const newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    delete newUser._id;
    delete newUser.__v;
    newUser.avatar = newUser.avatar ? newUser.avatar : "#ccc";
    newUser.status = newUser.status ? newUser.status : "ok";
    newUser.username = newUser.username ? newUser.username : null;
    newUser.online = newUser.online === true ? newUser.online : false;
    newUser.isDoctor = newUser.isDoctor === true ? newUser.isDoctor : false,
    newUser.associatedList = newUser.associatedList ? newUser.associatedList : [];
    return newUser;
};

const wrapUserData = function (users) {
    if(Object.prototype.toString.call(users) === "[object Object]") {
        users = wrapOne(users);
    } else {
        users = users.map((item) => wrapOne(item));
    }
    return users;
};

module.exports = wrapUserData;
