export async function main(ip: string) {
    console.log(ip);
    os.stdout.write("connect to");
    os.stdout.write(ip);
    await syscall("sys_connect", ip);
    
    for (let i = 0; i < 5; i++) {
        await syscall("sys_sendto", ip, i);
        os.stdout.write(`sendind data to ${ip}`);
    }
}

export const ping = main;