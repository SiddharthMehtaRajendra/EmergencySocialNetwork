var mongoose = require('mongoose');
var User = require('../models/user');
var data = [
    {
        username: 'yuanwentian',
        password: 'abcd1234'
    },
    {
        username: 'siddharthmehta',
        password: 'abcd1234'
    }
];

// Add some campgrounds
const addUsers = async () => data.forEach(function (seed) {
    User.create(seed, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            // console.log("added to the user");
        }
    });
});

const removeUsers = async () => {
    // Remove all campgrounds
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("remove users");
        }
    });
};

removeUsers().then(() => {
    console.log('Success Removal');
});
addUsers().then(() => {
    console.log('Success Add');
});
