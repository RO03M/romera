import { Kernel } from "@romos/kernel";
import { useCallback, useEffect, useState } from "preact/hooks";
import { safe } from "../utils/safe";

export function useSystem() {
    const [iconMap, setIconMap] = useState(new Map<string, string>());

	const handleSystemChange = useCallback(async () => {
		const systemFile = await Kernel.instance().filesystem.readFile(
			"/usr/system",
			{
				decode: true
			}
		);

		const systemJson = safe(() => JSON.parse(systemFile ?? "{}"));

        const icons = systemJson.data.icons && typeof systemJson.data.icons === "object" ? systemJson.data.icons : {};
        const iconMap = new Map<string, string>(Object.entries(icons));

        setIconMap(iconMap);
	}, []);

	useEffect(() => {
		handleSystemChange();
		Kernel.instance().filesystem.watch("/usr/system", handleSystemChange);
	}, [handleSystemChange]);

    return {
        iconMap
    };
}
