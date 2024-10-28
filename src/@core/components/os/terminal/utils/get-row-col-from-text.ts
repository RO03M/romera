export function rowIndexFromCursor(cursor: number, rowLength: number) {
	return Math.floor(cursor / rowLength);
}

export function columnIndexFromCursor(cursor: number, rowLength: number) {
	return cursor % rowLength;
}

export function rowCountFromText(text: string, rowLength: number) {
	if (rowLength === 0) {
		return 0;
	}
	return Math.ceil(text.length / rowLength);
}

export function rowCountFromTextSize(size: number, rowLength: number) {
	if (rowLength === 0) {
		return 0;
	}
	return Math.ceil(size / rowLength);
}

/**
 * Get the row and column position from a text given the index of the cursor we want to know the position and the number of columns we should consider that the text has
 * Row length is the number of columns dumbass
 */
export function getRowColIndexFromCursor(
	cursorIndex: number,
	rowLength: number
) {
	const rowIndex = rowIndexFromCursor(cursorIndex, rowLength);
	const columnIndex = columnIndexFromCursor(cursorIndex, rowLength);

	return {
		row: rowIndex,
		column: columnIndex
	};
}
