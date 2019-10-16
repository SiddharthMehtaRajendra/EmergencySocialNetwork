/* eslint-disable no-undef */
const temp = require('../../client/js/lib/validation');

describe('Example', () => {
    describe('First', () => {
        test('Example Test', () => {
            expect('abc').toEqual('abc');
            expect(temp.validatePassword('12312').result).toEqual(true);
        });
    });
});
