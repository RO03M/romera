import { EEXIST, ENOENT } from "./errors";
import { btc } from "@romos/utils";
import { safe } from "@romos/utils";
import { IDBBackend } from "./backend/idb-backend";
import { Dirent } from "./dirent";
import { FilesystemWatcher } from "./filesystem-watcher";
import { Stat } from "./stat";
import textEncoder from "./text-encoder";
import type {
	HydrationData,
	MakeDirectoryOptions,
	ReadDirOptions,
	ReadFileOptions,
	WatchCallback
} from "./types";
import {
	format,
	normalize,
	splitParentPathAndNodeName,
	splitPath
} from "./utils/path";
import type { Backend } from "./backend/backend";

const STAT_KEY = 0;

export type FSMap = Map<string | 0, Stat | FSMap>;

interface FilesystemOptions {
	backend?: Backend;
}

export class Filesystem {
	public watcher: FilesystemWatcher = new FilesystemWatcher();
	public readonly backend: Backend;
	public fsName: string;
	private iused = 0;
	private root: FSMap = new Map([
		["/", new Map([[STAT_KEY, new Stat("dir", 0, 0)]])]
	]);

	constructor(fsName: string, options?: FilesystemOptions) {
		const { backend = new IDBBackend() } = options ?? {};

		this.fsName = fsName;
		this.backend = backend;
	}

	public setRoot(fsmap: FSMap) {
		this.root = fsmap;
		this.iused = this.getMaxINode(fsmap);
	}

	private getMaxINode(fsmap: FSMap) {
		const stat = fsmap.get(0);
		let maxInode = stat instanceof Stat ? stat.inode : 0;

		for (const [_, value] of fsmap.entries()) {
			if (!(value instanceof Stat)) {
				const inode = this.getMaxINode(value);

				maxInode = Math.max(maxInode, inode);
			}
		}

		return maxInode;
	}

	public async hydrate(data: HydrationData, inheritPath = "/") {
		const absolutePath = normalize(`${inheritPath}/${data.name}`);
		console.log(absolutePath, data);
		if (data.type === "dir") {
			if (absolutePath !== "/") {
				this.mkdir(absolutePath);
			}

			if (data.nodes) {
				for (const child of data.nodes) {
					await this.hydrate(child, absolutePath);
				}
			}
		} else if (data.type === "file") {
			if (data.content === undefined) {
				data.content = "";
			}

			if (Array.isArray(data.content)) {
				await this.writeFile(absolutePath, new Uint8Array(data.content));
				return;
			}

			await this.writeFile(absolutePath, data.content);
		} else if (data.type === "symlink" && data.target !== undefined) {
			this.symlink(data.target, absolutePath);
		}
	}

	public async getJSON() {
		const rootJSON = await this.buildJSONTree(this.root);
		if (rootJSON === undefined) {
			return;
		}
		return rootJSON[0];
	}

	private async buildJSONTree(data: FSMap | Stat, inheritPath = "") {
		if (data instanceof Stat) {
			return;
		}

		const response: HydrationData[] = [];

		for (const [key, value] of data) {
			if (value instanceof Stat) {
				continue;
			}

			const stat = value.get(STAT_KEY);
			if (stat instanceof Stat) {
				const currentPath = normalize(`${inheritPath}/${key}`);
				const entry: HydrationData = {
					name: key.toString(),
					type: stat.type,
					nodes: await this.buildJSONTree(value, currentPath)
				};
				if (stat.target) {
					entry.target = stat.target;
				}

				if (stat.isFile()) {
					// const content = this.inodeTable.get(stat.inode);
					const content = await this.backend.readFile(stat.inode);
					if (content !== undefined) {
						entry.content = Array.from(content);
					}
				}

				response.push(entry);
			}
		}

		return response;
	}

	private lookup(filepath: string, followSymbolicLink = true) {
		let dir: FSMap = this.root;
		const parts = splitPath(filepath);
		let dirtyPath = "";

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			dirtyPath += part;

			const currentDir = dir.get(part);

			if (currentDir instanceof Stat) {
				throw new Error("WTF");
			}

			if (currentDir === undefined) {
				throw new ENOENT(normalize(dirtyPath));
			}

			dir = currentDir;

			if (followSymbolicLink) {
				const stat = dir.get(STAT_KEY);
				if (!(stat instanceof Stat)) {
					continue;
				}

				if (stat.type === "symlink" && stat.target !== undefined) {
					const targetPath = format({
						root: normalize(dirtyPath),
						base: stat.target!
					});
					dir = this.lookup(targetPath);
				}
			}
		}

		return dir;
	}

	public stat(filepath: string, symlink = false) {
		try {
			const stat = this.lookup(filepath, !symlink).get(STAT_KEY);
			if (stat instanceof Stat) {
				return stat;
			}

			return null;
		} catch {
			return null;
		}
	}

	public lstat(filepath: string) {
		return this.stat(filepath, true);
	}

	public readdir(
		path: string,
		options: ReadDirOptions & { withFileTypes: true }
	): Dirent[];
	public readdir(
		path: string,
		options: ReadDirOptions & { withFileTypes: false }
	): string[];
	public readdir(path: string, options?: ReadDirOptions): string[] | Dirent[];
	public readdir(path: string, options: ReadDirOptions = {}) {
		const { withFileTypes = false } = options;
		const dir = this.lookup(path);

		const filenames = Array.from(dir.keys()).filter((filename) => {
			return typeof filename === "string";
		});

		if (withFileTypes) {
			return filenames
				.map((filename) => {
					const resolvedPath = normalize(`${path}/${filename}`);

					const stat = this.stat(resolvedPath);
					if (stat === null) {
						return null;
					}

					return new Dirent(filename, stat.inode, stat.type);
				})
				.filter((dirent) => dirent instanceof Dirent);
		}

		return filenames;
	}

	public mkdir(filepath: string, options: MakeDirectoryOptions = {}) {
		const { parents } = options;

		try {
			this.lookup(filepath);
			throw EEXIST;
		} catch {}

		if (this.stat(filepath) !== null) {
			throw EEXIST;
		}

		const [dirname, basename] = splitParentPathAndNodeName(filepath);

		if (parents) {
			this.recursiveMkdir(dirname);
		}

		const dir = this.lookup(dirname);

		this.iused++;
		const entry: FSMap = new Map();
		const stat = new Stat("dir", this.iused, 0);
		entry.set(STAT_KEY, stat);
		dir!.set(basename, entry);
		this.watcher.emit(dirname, "change");
		this.watcher.emit(filepath, "created");
		this.backend.saveSuperblock(this.root);

		return stat;
	}

	private recursiveMkdir(filepath: string) {
		const parts = splitPath(filepath);
		let currentPath = "";

		for (const part of parts) {
			currentPath += part;
			currentPath = normalize(currentPath);

			btc(() => this.mkdir(currentPath));
		}
	}

	public rmdir(filepath: string) {
		const [dirname, basename] = splitParentPathAndNodeName(filepath);
		const dir = this.lookup(dirname);

		dir.delete(basename);
	}

	public async writeFile(filepath: string, _data: string | Uint8Array) {
		const [dirname, basename] = splitParentPathAndNodeName(filepath);

		const dir = this.lookup(dirname);

		let data = _data;
		if (typeof _data === "string") {
			data = textEncoder.encode(_data);
		}

		if (data instanceof Uint8Array) {
			const oldStat = this.stat(filepath);
			const oldExists = oldStat instanceof Stat;

			this.iused++;
			const entry: FSMap = new Map();
			const stat = oldExists
				? oldStat
				: new Stat("file", this.iused, data.byteLength);
			stat.size = data.byteLength;

			entry.set(STAT_KEY, stat);

			dir.set(basename, entry);

			await this.backend.writeFile(stat.inode, data);
			this.backend.saveSuperblock(this.root);
			this.watcher.emit(dirname, "change");
			this.watcher.emit(filepath, oldExists ? "change" : "created");
		} else {
			throw new Error("Invalid data type");
		}
	}

	public symlink(target: string, path: string) {
		const targetPath = format({ root: path, base: target });
		const [dirname, basename] = splitParentPathAndNodeName(path);
		const dir = this.lookup(dirname);
		const targetStat = this.stat(targetPath);

		if (targetStat === null) {
			throw new Error("Invalid target");
		}

		if (this.stat(path) !== null) {
			throw new Error("Cannot create symlink, file exists");
		}

		this.iused++;
		const entry: FSMap = new Map();
		const stat = new Stat("symlink", this.iused, target.length, target);
		entry.set(STAT_KEY, stat);
		dir.set(basename, entry);
		this.watcher.emit(dirname, "change");
		this.watcher.emit(path, "created");
		this.backend.saveSuperblock(this.root);
	}

	public rename(filepath: string, newName: string) {
		const oldStat = this.stat(filepath);

		if (oldStat === null) {
			throw new ENOENT(filepath);
		}

		const [dirname, basename] = splitParentPathAndNodeName(filepath);
		const dir = this.lookup(dirname);

		if (dir.get(basename) === undefined) {
			throw new ENOENT(filepath); // Shouldn't end down here, but fuck it
		}

		dir.set(normalize(newName), dir.get(basename)!);
		dir.delete(basename);
		this.watcher.emit(dirname, "change");
		this.backend.saveSuperblock(this.root);
	}

	public async readFile(
		filepath: string,
		options: ReadFileOptions & { decode: false }
	): Promise<Uint8Array | null>;
	public async readFile(
		filepath: string,
		options: ReadFileOptions & { decode: true }
	): Promise<string | null>;
	public async readFile(
		filepath: string,
		options?: ReadFileOptions
	): Promise<string | Uint8Array | null>;
	public async readFile(filepath: string, options: ReadFileOptions = {}) {
		const { decode = false } = options;

		const stat = this.stat(filepath);

		if (stat === null) {
			return null;
		}

		if (stat?.isDirectory()) {
			return null;
		}

		// const data = this.inodeTable.get(stat.inode);
		const data = await this.backend.readFile(stat.inode);

		if (data === undefined) {
			return null;
		}

		if (!decode) {
			return data;
		}

		return textEncoder.decode(data);
	}

	public unlink(filepath: string) {
		const stat = this.lstat(filepath);

		if (stat === null) {
			throw new Error("File not found");
		}

		if (stat.type === "dir") {
			throw new Error(`${filepath} is a directory`);
		}
	}

	public watch(filepath: string, callback: WatchCallback) {
		this.watcher.watch(filepath, callback);
	}
}
