/* istanbul ignore file */
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
let url = "mongodb://127.0.0.1/SB2ESN";
if(process.env.SERVER_TEST_DB) {
    url = `mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/${process.env.SERVER_TEST_DB}?retryWrites=true&w=majority`;
}

if(process.env.MONGODB_URI) {
    url = process.env.MONGODB_URI;
}

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", async () => {
    console.log("Mongoose connection open to " + url);
    // If use test DB
    if(process.env.SERVER_TEST_DB) {
        console.log("Clean DB First");
        await Promise.all(
            Object.keys(mongoose.connection.collections).map(async (key) => {
                if(key !== "counters") {
                    return mongoose.connection.collections[key].remove({});
                }
            })
        );
    }
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", async () => {
    console.log("Mongoose connection disconnected");
});

module.exports = mongoose;
