import { filesystem } from "../../../../../app";
import { normalize } from "../../../../filesystem/utils/path";

export class ApplicationConfig {
	private data = {
		x: "",
		y: "",
		defaultExecName: ""
	};

	constructor(data: { x?: string; y?: string; defaultExecName?: string }) {
		this.data.x = data.x ?? "";
		this.data.y = data.y ?? "";
		this.data.defaultExecName = data.defaultExecName ?? "";
	}

	public static fromText(text: string) {
        return ApplicationConfig.parser(text);
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
			case ".json":
				this.defaultExecName = "monaco";
				break;
			case ".pdf":
				this.defaultExecName = "pdfviewer";
				break;
			default:
				this.defaultExecName = "monaco";
				break;
		}
	}
}

export function getConfigFromApplication(applicationName: string) {
	const file = filesystem.readFile(
		normalize(`/usr/applications/${applicationName}`),
		{ decode: true }
	);

    if (file === null) {
        return new ApplicationConfig({});
    }

	const config = ApplicationConfig.fromText(file as string);

	return config;
}
