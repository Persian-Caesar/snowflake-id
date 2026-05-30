/**
 * Configuration options for the Snowflake ID generator.
 * Allows customization of bit allocation, epoch, encoding format, and more.
 */
export interface SnowflakeOptions {
    /** 
     * Number of bits allocated for the timestamp.
     * @default 42 (allows ~69 years from epoch)
     */
    timeBits?: number;

    /** 
     * Number of bits allocated for the worker/node identifier.
     * @default 10 (supports up to 1024 workers)
     */
    workerBits?: number;

    /** 
     * Number of bits allocated for the sequence number (per millisecond).
     * @default 12 (supports 4096 IDs per millisecond)
     */
    seqBits?: number;

    /** 
     * Custom epoch timestamp in milliseconds (Unix timestamp).
     * Use a fixed value like Twitter's epoch (1288834974657) for consistency.
     * @default 0 (Unix epoch)
     */
    epoch?: number;

    /** 
     * Unique identifier for this worker/node.
     * Must be unique across all instances generating IDs.
     * @default 1
     */
    workerId?: number;

    /** 
     * Enable Base62 encoding (0-9A-Za-z) for shorter, URL-safe IDs.
     * @default false
     */
    base62?: boolean;

    /** 
     * Enable Base36 encoding (0-9a-z) - more compact than decimal but less than Base62.
     * @default false
     */
    base36?: boolean;

    /** 
     * Custom alphabet to use for encoding (must match base length).
     * Useful for creating branded or domain-specific short IDs.
     */
    customAlphabet?: string;
}

/**
 * Parsed information from a Snowflake ID.
 */
export interface ParsedSnowflake {
    /** Full Date object of when the ID was generated */
    timestamp: Date;
    /** Timestamp in milliseconds since epoch */
    timestampMs: number;
    /** Worker ID that generated this snowflake */
    workerId: number;
    /** Sequence number within the same millisecond */
    sequence: number;
    /** Original ID string */
    id: string;
}

export class Snowflake {
    private readonly timeBits: number;
    private readonly workerBits: number;
    private readonly seqBits: number;
    private readonly epoch: number;
    private readonly workerId: number;
    private readonly maxSeq: number;
    private readonly base62: boolean;
    private readonly base36: boolean;
    private readonly alphabet: string;

    /** Current sequence number */
    private seq = 0;
    /** Last timestamp used (to handle sequence rollover) */
    private lastTimestamp = -1;

    /**
     * Creates a new Snowflake ID generator.
     * @param options Configuration options
     * @throws Error if total bits exceed 64
     */
    constructor(options: SnowflakeOptions = {}) {
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
    public generate(): string {
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
        const idBigInt =
            (BigInt(timestamp) << BigInt(this.workerBits + this.seqBits)) |
            (BigInt(this.workerId) << BigInt(this.seqBits)) |
            BigInt(this.seq);

        return this.encode(idBigInt);
    }

    /**
     * Generates multiple Snowflake IDs efficiently.
     * @param count Number of IDs to generate
     */
    public generateBatch(count: number): string[] {
        return Array.from({ length: count }, () => this.generate());
    }

    /**
     * Parses a Snowflake ID back into its components.
     * @param id The Snowflake ID (string or bigint)
     */
    public parse(id: string | bigint): ParsedSnowflake {
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
    public timeFromId(id: string | bigint): Date {
        return this.parse(id).timestamp;
    }

    /**
     * Validates whether a string is a valid Snowflake ID for this configuration.
     * @param id ID to validate
     */
    public isValid(id: string): boolean {
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
    private encode(num: bigint): string {
        if (this.base62 || this.base36) {
            return this.toBaseX(num, this.base62 ? 62 : 36);
        }

        return num.toString();
    }

    /**
     * Converts a BigInt to a custom base string.
     */
    private toBaseX(num: bigint, base: number): string {
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
    private decode(id: string): bigint {
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
    private waitNextMillis(current: number): number {
        let ts = Date.now() - this.epoch;
        while (ts <= current) {
            ts = Date.now() - this.epoch;
        }

        return ts;
    }
}

export default Snowflake;