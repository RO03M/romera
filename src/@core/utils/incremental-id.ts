let lastId = 0;

export function incrementalId() {
    lastId++;

    return lastId;
}