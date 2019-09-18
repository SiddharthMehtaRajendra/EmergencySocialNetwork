const mongoose = require("mongoose");
const User = require("../models/user");
const data = [
    { 
        username: "yuanwet111",
        password: "abcd1234"
    },
    {
        username: "siddhar111",
        password: "abcd1234"
    }
];

// Add some users
const addUsers = async () => data.forEach(function(seed){
    User.create(seed, function(err, user){
        if(err){
            console.log(err);
        } else {
            //console.log("added to the user");
        }
    });
});

const removeUsers = async () => {
    // Remove all  users
    User.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            //console.log("remove users");
        }
    });
}

// removeUsers().then(()=>{
//     console.log("Success Removal")
// })

addUsers().then(() => {
    console.log("Success Add")
})


