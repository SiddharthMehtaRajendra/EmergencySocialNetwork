/* eslint-disable no-undef */

const { getStatusColor } = require("../../client/js/constant/statusColor");

describe("Status Color Test", () => {
    test("Status Color Test", () => {
        expect(getStatusColor("ok",false,true)).toEqual("#7ED321");
        expect(getStatusColor("ok",false,false).join(",")).toEqual("126,211,33");
        expect(getStatusColor("emergency",false,true)).toEqual("#F41C3B");
        expect(getStatusColor("emergency",false,false).join(",")).toEqual("244,28,59");
        expect(getStatusColor("help",false,true)).toEqual("#FFCC00");
        expect(getStatusColor("help",false,false).join(",")).toEqual("255,204,0");
        expect(getStatusColor("need help",false,true)).toEqual("#FFCC00");
        expect(getStatusColor("need help",false,false).join(",")).toEqual("255,204,0");
        expect(getStatusColor("no status",false,true)).toEqual("#999999");
        expect(getStatusColor("no status",false,false).join(",")).toEqual("153,153,153");
        expect(getStatusColor("emergency",true,true)).toEqual("#F41C3B");
        expect(getStatusColor("emergency",true,false).join(",")).toEqual("244,28,59");
        expect(getStatusColor("ok",true,true)).toEqual("#1983FF");
        expect(getStatusColor("ok",true,false).join(",")).toEqual("25,131,255");
        expect(getStatusColor("not exist",false,true)).toEqual("#999999");
        expect(getStatusColor("not exist",false,false).join(",")).toEqual("153,153,153");
    });
});
