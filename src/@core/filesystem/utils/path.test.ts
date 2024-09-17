import { describe, expect, test } from "vitest";
import { normalize } from "./path";

describe("absolute path testing", () => {
	test("format single dot", () => {
	    expect(normalize("./home")).toBe("/home");
	});

	test("format slashes from path", () => {
	    expect(normalize("/")).toBe("/");
	    expect(normalize("")).toBe("/");
	    expect(normalize("home/teste")).toBe("/home/teste");
	    expect(normalize("home/teste/")).toBe("/home/teste");
	    expect(normalize("/home/teste")).toBe("/home/teste");
	    expect(normalize("/home/teste/")).toBe("/home/teste");
	});

	test("replace double dot (go back)", () => {
		expect(normalize("..")).toBe("/");
		expect(normalize("../")).toBe("/");
		expect(normalize("/..")).toBe("/");
		expect(normalize("/../a")).toBe("/a");
		expect(normalize("../a")).toBe("/a");
		expect(normalize("/a/b/../c")).toBe("/a/c");
		expect(normalize("/a/b/../c/..")).toBe("/a");
		expect(normalize("/a/b/../c/../..")).toBe("/");
		expect(normalize("/a/b/../../c")).toBe("/c");
		expect(normalize("/a/b/../c/../d/./e")).toBe("/a/d/e");
	});

    test("support for slash redundancy", () => {
        expect(normalize("//home/////projects")).toBe("/home/projects");
    });
});
