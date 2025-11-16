export function mapToObject(map: Map<string | number, unknown>) {
    let object: Record<string | number, unknown> = {};
    for (let [key, value] of map) {
        if (value instanceof Map) {
            object[key] = mapToObject(value);
        } else {
            object[key] = value;
        }
    }
    return object;
}