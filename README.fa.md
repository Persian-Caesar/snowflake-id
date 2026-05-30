# @Persian-Caesar/Snowflake-ID

**یک ژنراتور Snowflake ID مدرن، انعطاف‌پذیر و با کارایی بالا برای TypeScript و JavaScript.**

الهام‌گرفته از سیستم Twitter Snowflake و Discord، این کتابخانه به شما کنترل کامل بر طول، فرمت و ساختار شناسه‌ها می‌دهد در حالی که احتمال تکرار (Collision) تقریباً صفر است.

---

## ✨ ویژگی‌ها

- **قابل تنظیم بالا** — کنترل کامل تعداد بیت‌های زمان، ورکر و sequence
- **فرمت‌های خروجی متنوع** — اعشاری، Base62 (پیشنهادی)، Base36 یا الفبای سفارشی
- **پشتیبانی از شناسه‌های کوتاه** — تولید شناسه ۸ تا ۱۳ کاراکتری (شبیه Discord و تلگرام)
- **تجزیه و تحلیل داخلی** — استخراج زمان، شناسه ورکر و sequence از هر ID
- **تولید دسته‌ای** — تولید سریع هزاران شناسه
- **تایپ‌اسکریپت اول** — کاملاً تایپ‌سیف و دارای JSDoc عالی
- **بدون وابستگی** — سبک و بسیار سریع

---

## 📦 نصب

```bash
npm install @persian-caesar/snowflake-id
# یا
yarn add @persian-caesar/snowflake-id
# یا
pnpm add @persian-caesar/snowflake-id
```

---

## 🚀 شروع سریع

```ts
import Snowflake from '@persian-caesar/snowflake-id';

const snowflake = new Snowflake();

console.log(snowflake.generate());
// 1749123456789012345
```

### سبک Discord (کوتاه و تمیز - توصیه شده)

```ts
const discordStyle = new Snowflake({
  timeBits: 38,
  workerBits: 8,
  seqBits: 10,
  base62: true
});

console.log(discordStyle.generate());
// مثال: 9K8mL2pXvR7t
```

---

## ⚙️ تنظیمات

| گزینه              | نوع      | پیش‌فرض | توضیح |
|--------------------|----------|---------|-------|
| `timeBits`         | `number` | 42      | بیت‌های زمان (بیشتر = طول عمر بیشتر) |
| `workerBits`       | `number` | 10      | بیت‌های شناسه ورکر/نود |
| `seqBits`          | `number` | 12      | بیت‌های sequence در هر میلی‌ثانیه |
| `epoch`            | `number` | 0       | Epoch سفارشی (توصیه می‌شود) |
| `workerId`         | `number` | 1       | شناسه منحصر به فرد اینインスタンス |
| `base62`           | `boolean`| false   | استفاده از Base62 (کوتاه و امن برای URL) |
| `base36`           | `boolean`| false   | استفاده از Base36 |
| `customAlphabet`   | `string` | ...     | الفبای سفارشی |

**مجموع بیت‌ها نباید بیشتر از ۶۴ باشد.**

---

## 📖 مثال‌ها

### ۱. شبیه توییتر (طولانی و دقیق)

```ts
const twitter = new Snowflake({
  epoch: 1288834974657, // Epoch توییتر
  timeBits: 41,
  workerBits: 5,
  seqBits: 18,
});
```

### ۲. شبیه Discord (کوتاه)

```ts
const discord = new Snowflake({
  timeBits: 38,
  workerBits: 8,
  seqBits: 10,
  base62: true
});
```

### ۳. شناسه‌های خیلی کوتاه (۸-۱۰ کاراکتر)

```ts
const short = new Snowflake({
  timeBits: 32,
  workerBits: 6,
  seqBits: 8,
  base62: true
});
```

### ۴. تجزیه شناسه

```ts
const parsed = discord.parse(id);

console.log(parsed.timestamp);     // تاریخ ساخت
console.log(parsed.workerId);      // شناسه ورکر
console.log(parsed.sequence);      // شماره sequence
```

---

## 🔒 تضمین عدم تکرار

- مدیریت صحیح sequence و انتظار در صورت سرریز
- پشتیبانی از چندین ورکر به صورت ایمن
- امکان تنظیم Epoch برای جلوگیری از تداخل بین پروژه‌ها

---

## 📊 مقایسه طول شناسه‌ها

| کاربرد               | طول تقریبی (Base62) | طول عمر تقریبی |
|---------------------|----------------------|----------------|
| سبک توییتر         | ۱۸-۱۹ کاراکتر       | ~۶۹ سال       |
| سبک Discord        | ۱۲-۱۳ کاراکتر       | ~۸.۵ سال      |
| خیلی کوتاه          | ۹-۱۰ کاراکتر        | ~۱۳۶ سال      |

---

**لایسنس:** MIT  
**تهیه شده با ❤️ برای سیستم‌های مقیاس‌پذیر**