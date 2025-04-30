async function main(...args: string[]) {
	const command = args.join(" ");

	return new Promise((res) => {
		const interval = setInterval(async () => {
            console.log(command);
			await syscall("fork", command);
		}, 1000);
	});
}

export const watch = main;