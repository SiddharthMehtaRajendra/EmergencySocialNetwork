/* eslint-disable no-undef */
const validator = require("../../client/js/lib/validation");

describe("Validation Test", () => {
    describe("Username Validation", () => {
        test("Validate Username Test", () => {
            expect(validator.validateUserName("ab").result).toEqual(false);
            expect(validator.validateUserName("mobile").result).toEqual(false);
            expect(validator.validateUserName("#$@$#").result).toEqual(false);
            expect(validator.validateUserName("fseteamsb2").result).toEqual(true);
        });
    });

    describe("Password Validation", () => {
        test("Validate Password Test", () => {
            expect(validator.validatePassword("df").result).toEqual(false);
            expect(validator.validatePassword("doug~").result).toEqual(false);
            expect(validator.validatePassword("teamsb2pwd").result).toEqual(true);
            expect(validator.validatePassword("teamsb2pwd$$@").result).toEqual(true);
        });
    });

    describe("Confirm Password Validation", () => {
        test("Confirm Password Test", () => {
            expect(validator.validateConfirmPassword("mona", "ramona").result).toEqual(false);
            expect(validator.validateConfirmPassword("peter", "peter").result).toEqual(true);
        });
    });
});
