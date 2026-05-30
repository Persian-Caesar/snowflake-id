"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
class Snowflake {
    timeBits;
    workerBits;
    seqBits;
    epoch;
    workerId;
    maxSeq;
    base62;
    base36;
    alphabet;
    /** Current sequence number */
    seq = 0;
    /** Last timestamp used (to handle sequence rollover) */
    lastTimestamp = -1;
    /**
     * Creates a new Snowflake ID generator.
     * @param options Configuration options
     * @throws Error if total bits exceed 64
     */
    constructor(options = {}) {
        this.timeBits = options.timeBits ?? 42;
        this.workerBits = options.workerBits ?? 10;
        this.seqBits = options.seqBits ?? 12;
        this.epoch = options.epoch ?? 0;
        this.workerId = (options.workerId ?? 1) & ((1 << this.workerBits) - 1);
        this.base62 = options.base62 ?? false;
        this.base36 = options.base36 ?? false;
        this.alphabet = options.customAlphabet || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const totalBits = this.timeBits + this.workerBits + this.seqBits;
        if (totalBits > 64) {
            throw new Error("Total bits cannot exceed 64");
        }
        this.maxSeq = (1 << this.seqBits) - 1;
    }
    /**
     * Generates a new unique Snowflake ID.
     * @returns A unique ID as string (decimal or encoded)
     */
    generate() {
        let timestamp = Date.now() - this.epoch;
        // Handle sequence increment within the same millisecond
        if (timestamp === this.lastTimestamp) {
            this.seq = (this.seq + 1) & this.maxSeq;
            // If sequence overflows, wait for next millisecond
            if (this.seq === 0) {
                timestamp = this.waitNextMillis(timestamp);
            }
        }
        else {
            this.seq = 0;
        }
        this.lastTimestamp = timestamp;
        // Build 64-bit ID
        const idBigInt = (BigInt(timestamp) << BigInt(this.workerBits + this.seqBits)) |
            (BigInt(this.workerId) << BigInt(this.seqBits)) |
            BigInt(this.seq);
        return this.encode(idBigInt);
    }
    /**
     * Generates multiple Snowflake IDs efficiently.
     * @param count Number of IDs to generate
     */
    generateBatch(count) {
        return Array.from({ length: count }, () => this.generate());
    }
    /**
     * Parses a Snowflake ID back into its components.
     * @param id The Snowflake ID (string or bigint)
     */
    parse(id) {
        const num = typeof id === 'bigint' ? id : this.decode(id);
        const maskSeq = (1n << BigInt(this.seqBits)) - 1n;
        const maskWorker = (1n << BigInt(this.workerBits)) - 1n;
        const sequence = Number(num & maskSeq);
        const workerId = Number((num >> BigInt(this.seqBits)) & maskWorker);
        const timestampMs = Number(num >> BigInt(this.workerBits + this.seqBits)) + this.epoch;
        return {
            timestamp: new Date(timestampMs),
            timestampMs,
            workerId,
            sequence,
            id: id.toString()
        };
    }
    /**
     * Extracts the generation timestamp from a Snowflake ID.
     * @param id The Snowflake ID
     */
    timeFromId(id) {
        return this.parse(id).timestamp;
    }
    /**
     * Validates whether a string is a valid Snowflake ID for this configuration.
     * @param id ID to validate
     */
    isValid(id) {
        try {
            const num = this.decode(id);
            return num > 0n && num.toString().length > 5;
        }
        catch {
            return false;
        }
    }
    /**
     * Encodes the BigInt ID according to configured format (Base62, Base36, or decimal).
     */
    encode(num) {
        if (this.base62 || this.base36) {
            return this.toBaseX(num, this.base62 ? 62 : 36);
        }
        return num.toString();
    }
    /**
     * Converts a BigInt to a custom base string.
     */
    toBaseX(num, base) {
        let result = "";
        let n = num;
        while (n > 0n) {
            result = this.alphabet[Number(n % BigInt(base))] + result;
            n = n / BigInt(base);
        }
        return result || "0";
    }
    /**
     * Decodes a string ID back to BigInt.
     * Supports decimal, Base62, and Base36.
     */
    decode(id) {
        if (/^\d+$/.test(id)) {
            return BigInt(id);
        }
        const base = this.base62 ? 62 : 36;
        let result = 0n;
        for (let char of id) {
            const index = this.alphabet.indexOf(char);
            if (index === -1) {
                throw new Error(`Invalid character in ID: ${char}`);
            }
            result = result * BigInt(base) + BigInt(index);
        }
        return result;
    }
    /**
     * Waits until the next millisecond to prevent sequence overflow collision.
     */
    waitNextMillis(current) {
        let ts = Date.now() - this.epoch;
        while (ts <= current) {
            ts = Date.now() - this.epoch;
        }
        return ts;
    }
}
exports.Snowflake = Snowflake;
exports.default = Snowflake;
