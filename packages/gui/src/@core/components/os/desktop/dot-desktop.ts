import { Kernel } from "@romos/kernel";
import { safe } from "../../../utils/safe";

interface DotDesktop {
	apps: {
		[key: string]: {
			icon?: string
		};
	};
	grid: {
		[key: string]: string;
	};
}

function isDotDesktop(data: unknown): data is DotDesktop {
    if (data === null || typeof data !== "object") {
        return false;
    }

    if (!("apps" in data) || !("grid" in data)) {
        return false;
    }

    return true;
}

export async function getDotDesktop(): Promise<DotDesktop> {
    const dotDesktopFile = await Kernel.instance().filesystem.readFile("/home/romera/.desktop", { decode: true });
    if (dotDesktopFile === null) {
        return {
            apps: {},
            grid: {}
        };
    }
    
    const dotDesktop = safe(() => JSON.parse(dotDesktopFile));
    
    
    if (dotDesktop.error !== null || !isDotDesktop(dotDesktop.data)) {
        return {
            apps: {},
            grid: {}
        };
    }

    return dotDesktop.data;
}