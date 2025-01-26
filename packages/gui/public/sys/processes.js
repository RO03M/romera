async function fork(command, args = [], ppid) {
    return await syscall("createProcess", command, args, ppid);
}