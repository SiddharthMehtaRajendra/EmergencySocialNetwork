/* eslint-disable no-undef */

const processMsg = require('../../server/index');

test('messageParsing', () => {
    const obj = {
        from: '1111',
        to: '2222',
        type: '0',
        content: '234',
        status: '1',
        chatId: '2'
    };
    const expected = {
        chatId: '2',
        content: '234',
        from: '1111',
        status: '1',
        to: '2222',
        type: '0'
    };
    expect(processMsg(obj).chatId).toBe(expected.chatId);
    expect(processMsg(obj).from).toBe(expected.from);
    expect(processMsg(obj).content).toBe(expected.content);
    expect(processMsg(obj).status).toBe(expected.status);
    expect(processMsg(obj).type).toBe(expected.type);
    expect(processMsg(obj).to).toBe(expected.to);
});

const { tokenParsing, exclude } = require('../../server/auth/checkToken');

test('excludeUrls', () => {
    expect(exclude('/')).toBe(true);
    expect(exclude('/my')).toBe(false);
    expect(exclude('')).toBe(false);
});

test('invalidTokenParsing', () => {
    expect(tokenParsing('123').error).toBe(true);
});

test('validTokenParsing', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE1NzExNzc1MzIsImV4cCI6MTU3MTI2MzkzMn0.HuzAcqFwTJuqaMmqNhlRlVjDaG2819QVwCUVOXF8BIg';
    expect(tokenParsing(token).error).toBe(false);
    expect(tokenParsing(token).decodedInfo.username).toBe('1111');
});
