export async function fileToBuffer(file: File) {
	const buffer = await file
		.arrayBuffer()
		.then((buffer) => new Uint8Array(buffer));

	return buffer;
}
