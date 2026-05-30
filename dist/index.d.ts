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
export declare class Snowflake {
    private readonly timeBits;
    private readonly workerBits;
    private readonly seqBits;
    private readonly epoch;
    private readonly workerId;
    private readonly maxSeq;
    private readonly base62;
    private readonly base36;
    private readonly alphabet;
    /** Current sequence number */
    private seq;
    /** Last timestamp used (to handle sequence rollover) */
    private lastTimestamp;
    /**
     * Creates a new Snowflake ID generator.
     * @param options Configuration options
     * @throws Error if total bits exceed 64
     */
    constructor(options?: SnowflakeOptions);
    /**
     * Generates a new unique Snowflake ID.
     * @returns A unique ID as string (decimal or encoded)
     */
    generate(): string;
    /**
     * Generates multiple Snowflake IDs efficiently.
     * @param count Number of IDs to generate
     */
    generateBatch(count: number): string[];
    /**
     * Parses a Snowflake ID back into its components.
     * @param id The Snowflake ID (string or bigint)
     */
    parse(id: string | bigint): ParsedSnowflake;
    /**
     * Extracts the generation timestamp from a Snowflake ID.
     * @param id The Snowflake ID
     */
    timeFromId(id: string | bigint): Date;
    /**
     * Validates whether a string is a valid Snowflake ID for this configuration.
     * @param id ID to validate
     */
    isValid(id: string): boolean;
    /**
     * Encodes the BigInt ID according to configured format (Base62, Base36, or decimal).
     */
    private encode;
    /**
     * Converts a BigInt to a custom base string.
     */
    private toBaseX;
    /**
     * Decodes a string ID back to BigInt.
     * Supports decimal, Base62, and Base36.
     */
    private decode;
    /**
     * Waits until the next millisecond to prevent sequence overflow collision.
     */
    private waitNextMillis;
}
export default Snowflake;
