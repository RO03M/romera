import { describe, expect, test } from "vitest";
import { filename, normalize } from "./path";

describe("absolute path testing", () => {
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
	});
    
    test("handle single dot", () => {
        expect(normalize("./home")).toBe("/home");
        expect(normalize("/home/./..")).toBe("/");
        expect(normalize("/a/b/../c/../d/./e")).toBe("/a/d/e");
	});

    test("support for slash redundancy", () => {
        expect(normalize("//home/////projects")).toBe("/home/projects");
    });

	describe("filename handler", () => {
		test("Should return only the name without the extension", () => {
			expect(filename("file.ts")).toBe("file");
			expect(filename("/file.ts")).toBe("file");
			expect(filename("/var/file.ts")).toBe("file");
			expect(filename("/var/var/file.ts")).toBe("file");
		});
	});

});
