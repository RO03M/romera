import { describe, expect, test } from "vitest";
import { makeAbsolutePath } from "./make-absolute-path";

describe("absolute path testing", () => {
    test("make absolute path considering relative path", () => {
        expect(makeAbsolutePath("home/teste", "/")).toBe("/home/teste");
        expect(makeAbsolutePath("home/teste", "/foo")).toBe("/foo/home/teste");
        expect(makeAbsolutePath("home/teste/", "/foo")).toBe("/foo/home/teste");
        expect(makeAbsolutePath("home/teste", "/foo/")).toBe("/foo/home/teste");
    });

    // test("make absolute path ignoring relative path (starting with the slash '/' char", () => {
    //     expect(makeAbsolutePath("/home/teste", "/foo")).toBe("/home/teste");
    //     expect(makeAbsolutePath("/home/teste", "/")).toBe("/home/teste");
    //     expect(makeAbsolutePath("/home/teste", "/")).toBe("/home/teste");
    // });

    // test("make absolute path using double dots", () => {
    //     expect(makeAbsolutePath("/home/teste/..")).toBe("/home");
    //     expect(makeAbsolutePath("/home/teste/../..")).toBe("/");
    //     expect(makeAbsolutePath("/home/teste/../foda")).toBe("/home/foda");
    //     expect(makeAbsolutePath("/home/teste/../foda/../foda")).toBe("/home/foda");
    // });
});