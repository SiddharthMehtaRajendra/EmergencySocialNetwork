const processMsg = require('./index');

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
