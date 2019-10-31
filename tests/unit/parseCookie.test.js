/* eslint-disable no-undef */
const parseCookies = require("../../server/lib/parseCookies");

describe("parseCookies Test", () => {
    test("parseCookies Test", () => {
        const cookieStr = "foo=1;bar=2";
        const parsed = parseCookies(cookieStr);
        expect(parsed.foo).toEqual("1");
        expect(parsed.bar).toEqual("2");
    });
});
