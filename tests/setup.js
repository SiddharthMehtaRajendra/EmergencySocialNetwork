/* eslint-disable no-undef */
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
require('../database/model/User');
require('../database/model/Message');
require('../database/model/Chat');

beforeAll(async () => {
    const DB_URL = `mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/${process.env.TEST_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await Promise.all(
        Object.keys(mongoose.connection.collections).map(async key => {
            if (key !== 'counter') {
                return mongoose.connection.collections[key].remove({});
            }
        })
    );
});

afterAll(async () => {
    await mongoose.disconnect();
});
