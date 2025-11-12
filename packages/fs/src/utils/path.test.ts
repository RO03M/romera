import { describe, expect, test } from "vitest";
import { basename, filename, normalize } from "./path";
import { it } from "node:test";

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

	describe("basename", () => {
		test("Should return only the base name", () => {
			expect(basename("file.ts")).toBe("file.ts");
			expect(basename("/file.ts")).toBe("file.ts");
			expect(basename("/var/file.ts")).toBe("file.ts");
			expect(basename("/var/var/file.ts")).toBe("file.ts");
		});

		test("Should handle trailing slashes", () => {
			expect(basename("/var/var/file.ts/")).toBe("file.ts");
			expect(basename("/var/var/file/")).toBe("file");
			expect(basename("/var/")).toBe("var");
			expect(basename("/")).toBe("");
		});

		test("Should handle relative paths", () => {
			expect(basename("./file.ts")).toBe("file.ts");
			expect(basename("../file.ts")).toBe("file.ts");
			expect(basename("../dir/file.ts")).toBe("file.ts");
		});

		test("Should handle files without extensions", () => {
			expect(basename("/var/file")).toBe("file");
		});

		test("Should handle empty or invalid input", () => {
			expect(basename("")).toBe("");
			expect(basename("/")).toBe("");
			// @ts-expect-error
			expect(basename(undefined)).toBe("");
			// @ts-expect-error
			expect(basename(null)).toBe("");
		});
	})

});
