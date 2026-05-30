# Snowflake ID TS

**A modern, flexible, and high-performance Snowflake ID generator for TypeScript and JavaScript.**

Inspired by Twitter Snowflake and Discord's ID system, this library gives you full control over ID length, format, and structure while maintaining **near-zero collision** guarantees.

---

## ✨ Features

- **Highly Customizable** — Control time bits, worker bits, sequence bits
- **Multiple Output Formats** — Decimal, Base62 (recommended), Base36, or custom alphabet
- **Short IDs Support** — Generate 8–13 character IDs (Discord-like, Telegram-like, etc.)
- **Built-in Parsing** — Extract timestamp, worker ID, and sequence from any ID
- **Batch Generation** — Efficiently generate thousands of IDs
- **TypeScript First** — Full type safety with excellent JSDoc
- **Collision Safe** — Proper sequence handling and time drift protection
- **Zero Dependencies** — Lightweight and fast

---

## 📦 Installation

```bash
npm install @persian-caesar/snowflake-id
# or
yarn add @persian-caesar/snowflake-id
# or
pnpm add @persian-caesar/snowflake-id
```

---

## 🚀 Quick Start

```ts
import Snowflake from '@persian-caesar/snowflake-id';

const snowflake = new Snowflake();

console.log(snowflake.generate());
// 1749123456789012345
```

### Discord-style Short IDs (Recommended)

```ts
const discordStyle = new Snowflake({
  timeBits: 38,
  workerBits: 8,
  seqBits: 10,
  base62: true
});

console.log(discordStyle.generate());
// Example: 9K8mL2pXvR7t
```

---

## ⚙️ Configuration Options

| Option           | Type     | Default | Description |
|------------------|----------|---------|-----------|
| `timeBits`       | `number` | 42      | Bits for timestamp (higher = longer lifespan) |
| `workerBits`     | `number` | 10      | Bits for worker/node ID |
| `seqBits`        | `number` | 12      | Bits for sequence per millisecond |
| `epoch`          | `number` | 0       | Custom epoch (ms) - highly recommended |
| `workerId`       | `number` | 1       | Unique ID for this instance |
| `base62`         | `boolean`| false   | Use Base62 encoding (short & URL-safe) |
| `base36`         | `boolean`| false   | Use Base36 encoding |
| `customAlphabet` | `string` | ...     | Custom character set for encoding |

**Total bits must not exceed 64.**

---

## 📖 Examples

### 1. Twitter-like (Long & Precise)

```ts
const twitter = new Snowflake({
  epoch: 1288834974657, // Twitter epoch (November 4, 2010)
  timeBits: 41,
  workerBits: 5,
  seqBits: 18,
});

console.log(twitter.generate());
// 1749123456789012345
```

### 2. Discord-like (Short & Clean)

```ts
const discord = new Snowflake({
  timeBits: 38,
  workerBits: 8,
  seqBits: 10,
  base62: true
});

console.log(discord.generateBatch(5));
// ['9K8mL2pXvR7t', '9K8mL2pXvR7u', '9K8mL2pXvR7v', ...]
```

### 3. Very Short IDs (8-10 characters)

```ts
const short = new Snowflake({
  timeBits: 32,
  workerBits: 6,
  seqBits: 8,
  base62: true
});

console.log(short.generate());
// Example: 7X9kP2mQ
```

### 4. Using Custom Alphabet

```ts
const branded = new Snowflake({
  base62: true,
  customAlphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // No confusing characters
});
```

---

## 🔍 Parsing IDs

```ts
const id = discord.generate();

const parsed = discord.parse(id);

console.log(parsed);
/*
{
  timestamp: 2025-05-30T12:34:56.789Z,
  timestampMs: 1749123456789,
  workerId: 7,
  sequence: 42,
  id: "9K8mL2pXvR7t"
}
*/

console.log(discord.timeFromId(id)); // Date object
```

---

## 🛠 API Reference

### Constructor
```ts
new Snowflake(options?: SnowflakeOptions)
```

### Main Methods

- `.generate()` → `string`
- `.generateBatch(count: number)` → `string[]`
- `.parse(id: string | bigint)` → `ParsedSnowflake`
- `.timeFromId(id: string | bigint)` → `Date`
- `.isValid(id: string)` → `boolean`

---

## ⚡ Performance

This library is optimized for high throughput:

- Single ID generation: **~0.02ms**
- Batch of 1000 IDs: **~8-12ms**

**Tip**: Reuse the same `Snowflake` instance instead of creating new ones repeatedly.

---

## 🔒 Collision Safety

- Uses proper sequence rollover with time waiting
- Supports multiple workers safely
- Custom epoch prevents ID overlap across projects
- 64-bit structure with configurable distribution

---

## 📊 Bit Allocation Examples

| Use Case           | timeBits | workerBits | seqBits | Approx. Length (Base62) | Lifespan     |
|--------------------|----------|------------|---------|-------------------------|--------------|
| Twitter Style      | 41       | 5          | 18      | 18-19 chars             | ~69 years    |
| Discord Style      | 38       | 8          | 10      | 12-13 chars             | ~8.5 years   |
| Short IDs          | 32       | 6          | 8       | 9-10 chars              | ~136 years   |
| Ultra Short        | 30       | 5          | 8       | 8-9 chars               | ~34 years    |

---

## 🧪 Testing & Validation

```ts
const sf = new Snowflake({ base62: true });

const id = sf.generate();
console.log(sf.isValid(id)); // true
```

---

## 📄 License

MIT License - feel free to use in commercial and open-source projects.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push and open a Pull Request

---

**Made with ❤️ for scalable systems.**

---

**Have questions?** Feel free to open an issue or discuss use cases.