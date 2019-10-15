/* eslint-disable no-undef */
const mongoose = require('mongoose');
const TestDB = 'mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/tests?retryWrites=true&w=majority';

beforeAll(async () => {
    async function clearDB() {
        await Promise.all(
            Object.keys(mongoose.connection.collections).map(async key => {
                return mongoose.connection.collections[key].remove({});
            })
        );
    }

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TestDB, {
            useNewUrlParser: true
        });
    }
    await clearDB();
});

afterAll(async () => {
    await mongoose.disconnect();
});
