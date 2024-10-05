import { EEXIST, ENOENT } from "../../errors";
import { btc } from "../utils/better-try-catch";
import { incrementalId } from "../utils/incremental-id";
import { Dirent } from "./dirent";
import { Stat } from "./stat";
import textEncoder from "./text-encoder";
import type {
	HydrationData,
	MakeDirectoryOptions,
	ReadDirOptions,
	ReadFileOptions
} from "./types";
import {
	format,
	normalize,
	splitParentPathAndNodeName,
	splitPath
} from "./utils/path";

const STAT_KEY = 0;

type FSMap = Map<string | 0, Stat | FSMap>;

export class Filesystem {
	public fsName: string;
	public inodeTable: Map<Stat["inode"], Uint8Array> = new Map();
	public root: FSMap = new Map([
		["/", new Map([[STAT_KEY, new Stat("dir", 0, 0)]])]
	]);

	constructor(fsName: string) {
		this.fsName = fsName;
	}

	public hydrate(data: HydrationData, inheritPath = "/") {
		const absolutePath = normalize(`${inheritPath}/${data.name}`);
		if (data.type === "dir") {
			if (absolutePath !== "/") {
				this.mkdir(absolutePath);
			}

			if (data.nodes) {
				for (const child of data.nodes) {
					this.hydrate(child, absolutePath);
				}
			}
		} else if (data.type === "file") {
			this.writeFile(absolutePath, data.content ?? "");
		} else if (data.type === "symlink" && data.target !== undefined) {
			this.symlink(data.target, absolutePath);
		}
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

		const entry: FSMap = new Map();
		const stat = new Stat("dir", incrementalId(), 0);
		entry.set(STAT_KEY, stat);
		dir!.set(basename, entry);

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

	public writeFile(filepath: string, _data: string | Uint8Array) {
		const [dirname, basename] = splitParentPathAndNodeName(filepath);

		const dir = this.lookup(dirname);

		let data = _data;
		if (typeof _data === "string") {
			data = textEncoder.encode(_data);
		}

		if (data instanceof Uint8Array) {
			const oldStat = this.stat(filepath);

			const entry: FSMap = new Map();
			const stat =
				oldStat instanceof Stat
					? oldStat
					: new Stat("file", incrementalId(), data.byteLength);
			stat.size = data.byteLength;

			entry.set(STAT_KEY, stat);

			dir.set(basename, entry);
			this.inodeTable.set(stat.inode, data);
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

		const entry: FSMap = new Map();
		const stat = new Stat("symlink", incrementalId(), target.length, target);
		entry.set(STAT_KEY, stat);
		dir.set(basename, entry);
	}

	public readFile(filepath: string, options: ReadFileOptions = {}) {
		const { decode = false } = options;

		const stat = this.stat(filepath);

		if (stat === null) {
			return null;
		}

		if (stat?.isDirectory()) {
			throw new Error("Stat is a directory");
		}

		const data = this.inodeTable.get(stat.inode);

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
}
