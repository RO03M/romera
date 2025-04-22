function exit(code?: number, message?: string): never {
    process.exit(code ?? -1);
}

global.exit = exit;