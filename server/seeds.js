var mongoose = require("mongoose");
var User = require("./models/user");
var data = [
    { 
        username = "yuanwentian",
        password = "abcd1234"
    },
    {
        username = "siddharthmehta",
        password = "abcd1234"
    }
]
function seedDB(){
    // Remove all campgrounds
    User.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("remove users");
        }
         // Add some campgrounds
        data.forEach(function(seed){
            User.create(seed, function(err, user){
                if(err){
                    console.log(err);
                } else {
                    console.log("added to the user");
                }
            });
        });
    });
}

module.exports = seedDB;