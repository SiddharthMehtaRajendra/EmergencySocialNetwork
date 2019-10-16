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

const processMsg = require('../../server/index');

test('messageParsing', () => {
    const obj = { from: '1111', to: '2222', type: '0', content: '234', status: '1', chatId: '2' };
    const expected = { chatId: '2', content: '234', from: '1111', status: '1', to: '2222', type: '0' };
    expect(processMsg(obj).chatId).toBe(expected.chatId);
    expect(processMsg(obj).from).toBe(expected.from);
    expect(processMsg(obj).content).toBe(expected.content);
    expect(processMsg(obj).status).toBe(expected.status);
    expect(processMsg(obj).type).toBe(expected.type);
    expect(processMsg(obj).to).toBe(expected.to);
});

const checkToken = require('../../server/auth/checkToken');

test('excludeUrls', () => {
	const req = { originalUrl: '/heartbeat' };
	const res = { status: 200 };
    expect(checkToken(req, res, function() {return 'pass'})).toEqual('pass');
    // expect(exclude('/')).toBe(true);
    // expect(exclude('/my')).toBe(false);
});
