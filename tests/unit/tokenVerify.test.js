/* eslint-disable no-undef */

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
