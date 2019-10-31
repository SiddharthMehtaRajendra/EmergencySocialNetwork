/* eslint-disable no-undef */
const processMsg = require("../../server/lib/processMsg");

describe("processMsg Test", () => {
    test("processMsg Test", () => {
        const processed = processMsg({
            from: "from",
            to: "to",
            type: "0",
            content: "123",
            status: "ok",
            chatId: -1
        });
        expect(processed.time).not.toBeNull();
    });
});
