import { filesystem } from "../../../../../app";
import { normalize } from "@romos/fs";

export class ApplicationConfig {
	private data = {
		x: "",
		y: "",
		defaultExecName: ""
	};

	constructor(data: { x?: string; y?: string; defaultExecName?: string }) {
		this.data = {
			x: data.x ?? "",
			y: data.y ?? "",
			defaultExecName: data.defaultExecName ?? ""
		};
	}

	public static fromText(text: string) {
        return ApplicationConfig.parser(text);
	}

	public static async fromFSApplication(name: string): Promise<ApplicationConfig> {
		const file = await filesystem.readFile(
			normalize(`/usr/applications/${name}`),
			{ decode: true }
		);
	
		if (file === null) {
			return new ApplicationConfig({});
		}
	
		const config = ApplicationConfig.fromText(file as string);
	
		return config;
	}

	private static parser(text: string) {
		const instance = new ApplicationConfig({});
		const propertyLines = text
			.replace(/(\r\n|\n|\r|\t)/gm, "")
			.split(";")
			.filter((x) => x.includes("="));

		for (const line of propertyLines) {
			const [propertyName, value] = line.split("=");

			if (propertyName in instance.data) {
				instance.data[propertyName as keyof ApplicationConfig["data"]] = value;
			}
		}

		return instance;
	}

	public fsSync(name: string) {
		filesystem.writeFile(
			`/usr/applications/${name}`,
			this.stringify()
		);
	}

    public stringify() {
        const content = ["[Desktop Entry];"];
        for (const [key, value] of Object.entries(this.data)) {
            content.push(`${key}=${value};`);
        }

        return content.join("\n");
    }

	public get x() {
		return +this.data.x;
	}

	public get y() {
		return +this.data.y;
	}

	public set x(x: string | number) {
		this.data.x = x.toString();
	}

	public set y(y: string | number) {
		this.data.y = y.toString();
	}

	public get defaultExecName() {
		return this.data.defaultExecName;
	}

	private set defaultExecName(programName: string) {
		this.data.defaultExecName = programName;
	}

	public setDefaultExecNameFromExt(extension?: string) {
		switch(extension) {
			case ".png":
			case ".jpeg":
			case ".svg":
			case ".webp":
			case ".jpg":
			case ".gif":
				this.defaultExecName = "imageviewer";
				break;
			case ".mp4":
			case ".webm":
				this.defaultExecName = "videoViewer";
				break;
			case ".json":
				this.defaultExecName = "monaco";
				break;
			case ".pdf":
				this.defaultExecName = "pdfviewer";
				break;
			case ".jsdos":
				this.defaultExecName = "jsdos";
				break;
			default:
				this.defaultExecName = "monaco";
				break;
		}
	}
}

/**
 * @deprecated
 */
export async function getConfigFromApplication(applicationName: string) {
	const file = await filesystem.readFile(
		normalize(`/usr/applications/${applicationName}`),
		{ decode: true }
	);

    if (file === null) {
        return new ApplicationConfig({ });
    }

	const config = ApplicationConfig.fromText(file as string);

	return config;
}
