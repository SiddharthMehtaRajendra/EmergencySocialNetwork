/* eslint-disable no-undef */
const mongoose = require('mongoose');
const TestDbUrl = 'mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/tests?retryWrites=true&w=majority';
require('../database/model/User');
require('../database/model/Message');
require('../database/model/Chat');

beforeAll(async () => {
    await mongoose.connect(TestDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await Promise.all(
        Object.keys(mongoose.connection.collections).map(async key => {
            if (key !== 'counters') {
                return mongoose.connection.collections[key].remove({});
            }
        })
    );
});

afterAll(async () => {
    await mongoose.disconnect();
});
