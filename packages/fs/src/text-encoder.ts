function encode(string: string) {
    return new TextEncoder().encode(string);
}

function decode(input: Uint8Array) {
    return new TextDecoder().decode(input);
}

const textEncoder = {
    encode,
    decode
}

export default textEncoder;
