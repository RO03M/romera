import { describe, expect, it } from "vitest";
import { getRowColIndexFromCursor, rowCountFromText, rowCountFromTextSize } from "./get-row-col-from-text";

it("Get row and column based on cursor index and row length", () => {
	expect(getRowColIndexFromCursor(0, 3)).toEqual({ row: 0, column: 0 });
	expect(getRowColIndexFromCursor(3, 3)).toEqual({ row: 1, column: 0 });
	expect(getRowColIndexFromCursor(4, 3)).toEqual({ row: 1, column: 1 });
	expect(getRowColIndexFromCursor(4, 3)).toEqual({ row: 1, column: 1 });
	expect(getRowColIndexFromCursor(6, 3)).toEqual({ row: 2, column: 0 });
});

it("Should return the total count of rows from a text given a row length", () => {
	expect(rowCountFromText("abcdefg", 3)).toBe(3);
	expect(rowCountFromText("abc", 3)).toBe(1);
	expect(rowCountFromText("abc", 1)).toBe(3);
	expect(rowCountFromText("abc", 0)).toBe(0);

	expect(rowCountFromTextSize(7, 3)).toBe(3);
	expect(rowCountFromTextSize(3, 3)).toBe(1);
	expect(rowCountFromTextSize(3, 1)).toBe(3);
	expect(rowCountFromTextSize(3, 0)).toBe(0);
});
