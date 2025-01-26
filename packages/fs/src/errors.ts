export const EEXIST = new Error(
	"An object by the name pathname already exists"
);

export class ENOENT extends Error {
	constructor(path?: string) {
		super(`No such file or directory ${path}`);
		this.name = "ENOENT";
	}
}