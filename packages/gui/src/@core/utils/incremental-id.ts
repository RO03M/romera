const lastIdTable: Record<string, number> = {
	default: 0
};

export function incrementalId(key = "default") {
	if (lastIdTable[key] === undefined) {
		lastIdTable[key] = 0;
	}

	lastIdTable[key]++;

	return lastIdTable[key];
}
