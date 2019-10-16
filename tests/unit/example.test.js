/* eslint-disable no-undef */
const temp = require('../../client/js/lib/validation');

describe('Example', () => {
    describe('First', () => {
        test('Example Test', () => {
            expect('abc').toEqual('abc');
            expect(1).toEqual(2);
            expect(temp.validatePassword('12312').result).toEqual(true);
        });
    });
});
