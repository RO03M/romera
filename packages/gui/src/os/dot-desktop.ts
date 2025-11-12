import { Kernel } from "@romos/kernel";
import { safe } from "../@core/utils/safe";

export type DotDesktoObject = {
	name: string;
	icon: string;
	x: number;
	y: number;
}

export class DotDesktop {
	public apps = new Map<string, { icon?: string }>();
	public grid = new Map<string, string>();

	public static async load(): Promise<DotDesktop> {
		const file = await Kernel.instance().filesystem.readFile(
			"/home/romera/.desktop",
			{ decode: true }
		);

		if (file === null) {
			return new DotDesktop();
		}

		const json = safe(() => JSON.parse(file));

		if (json.error !== null) {
			return new DotDesktop();
		}

		return DotDesktop.parse(json.data);
	}

	public static parse(data: Record<string, unknown>): DotDesktop {
		const dotDesktop = new DotDesktop();

		if ("apps" in data && typeof data.apps === "object" && data.apps !== null) {
			for (const [key, value] of Object.entries(data.apps)) {
				if (typeof key !== "string") {
					continue;
				}

				dotDesktop.apps.set(key, value);
			}
		}

		if ("grid" in data && typeof data.grid === "object" && data.grid !== null) {
			for (const [key, value] of Object.entries(data.grid)) {
				if (typeof key !== "string" && typeof value !== "string") {
					continue;
				}

				dotDesktop.grid.set(key, value);
			}
		}

		return dotDesktop;
	}

	public get rgrid() {
		return new Map(
			Array.from(this.grid.entries()).map(([key, value]) => [value, key])
		);
	}

	public async save() {
		const content = this.stringify();

		await Kernel.instance().filesystem.writeFile(
			"/home/romera/.desktop",
			content
		);
	}

	public stringify(): string {
		return JSON.stringify({
			apps: Object.fromEntries(this.apps),
			grid: Object.fromEntries(this.grid)
		});
	}

	public get(): DotDesktoObject[] {
		const objects: DotDesktoObject[] = [];

		const rgrid = this.rgrid;

		for (const [name, metadata] of this.apps) {
			if (!rgrid.has(name)) {
				continue;
			}

			const [x, y] = rgrid.get(name)!.split(",");

			objects.push({
				icon: metadata?.icon ?? "",
				name: name,
				x: +x,
				y: +y
			});
		}

		return objects;
	}

	public getAt(x: number, y: number): DotDesktoObject | null {
		const appName = this.grid.get(`${x},${y}`);
		if (!appName) {
			return null;
		}

		const app = this.apps.get(appName);
		if (!app) {
			return null;
		}

		return {
			icon: app.icon ?? "",
			name: appName,
			x: x,
			y: y
		};
	}

	public getByName(name: string): DotDesktoObject | null {
		const app = this.apps.get(name);

		if (!app) {
			return null;
		}

		const [x, y] = this.getPos(name);

		if (x < 0 || y < 0) {
			return null;
		}

		return {
			icon: app.icon ?? "",
			name: name,
			x: x,
			y: y
		};
	}

	public getPos(name: string): [number, number] {
		const app = this.apps.get(name);
		if (!app) {
			return [-1, -1];
		}

		const rgrid = this.rgrid;

		const coords = rgrid.get(name);
		if (!coords) {
			return [-2, -2];
		}

		const [sx, sy] = coords.split(",");
		const x = +sx;
		const y = +sy;

		if (Number.isNaN(x) || Number.isNaN(y)) {
			return [-3, -3];
		}

		return [x, y];
	}

	public hasName(name: string): boolean {
		return this.apps.has(name);
	}

	public hasPos(x: number, y: number): boolean {
		return this.grid.has(`${x},${y}`);
	}

	public move(name: string, x: number, y: number) {
		const [oldX, oldY] = this.getPos(name);

		this.grid.delete(`${oldX},${oldY}`);
		this.grid.set(`${x},${y}`, name);
	}

	public add(name: string, x: number, y: number, metadata: { icon?: string }) {
		this.apps.set(name, metadata);
		this.grid.set(`${x},${y}`, name);
	}

	public delete(name: string) {
		this.apps.delete(name);

		const [x, y] = this.getPos(name);
		this.grid.delete(`${x},${y}`);
	}

	public getEmptyCell(maxX: number, maxY: number): [number, number] {
		for (let x = 0; x < maxX; x++) {
			for (let y = 0; y < maxY; y++) {
				if (!this.hasPos(x, y)) {
					return [x, y];
				}
			}
		}

		return [-1, -1];
	}
}
