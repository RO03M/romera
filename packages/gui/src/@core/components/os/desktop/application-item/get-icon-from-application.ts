import { filesystem } from "../../../../../app";
import { normalize } from "@romos/fs";

export function getIconFromApplication(name: string) {
	const stat = filesystem.stat(`/home/romera/desktop/${normalize(name)}`);

	if (stat?.isDirectory()) {
		return "./application-icons/folder.png";
	}
    
    if (stat?.isFile()) {
		return "./application-icons/blank-icon.png";
	}

    return "./application-icons/blank-icon.png";
}
