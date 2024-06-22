export function ageDiff(fromDate: Date) {
    const millisecondsFromTargetDate = Date.now() - fromDate.getTime();

    return Math.floor(millisecondsFromTargetDate / 0x757B12C00);
}