export interface SnowflakeOption {
    mid?: number;
    offset?: number;
}
export default class Snowflake {
    private seq;
    private mid;
    private offset;
    private lastTime;
    constructor(options: SnowflakeOption);
    generate(): string | null;
}
