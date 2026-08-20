# স্বপ্ন সঞ্চয় সমবায় সমিতি — ব্যাকএন্ড (Node.js + Express + MongoDB)

এই প্রজেক্টে সমিতির সব হিসাব (জিম্মাদার, সদস্য, মাসিক/এককালীন জমা, আয়-ব্যয়, বিশেষ চাঁদা)
MongoDB ডাটাবেজে জমা থাকে। ফ্রন্টএন্ড (public/index.html) একই Express সার্ভার থেকে সার্ভ হয়
এবং API-এর মাধ্যমে ডাটাবেজের সাথে কথা বলে।

## যা যা লাগবে
- Node.js (v18 বা তার বেশি) — https://nodejs.org থেকে ইনস্টল করুন
- একটা MongoDB Atlas অ্যাকাউন্ট (ফ্রি) — https://www.mongodb.com/cloud/atlas/register

## ধাপ ১: MongoDB Atlas সেটআপ
1. Atlas-এ লগইন করে একটা ফ্রি (M0) ক্লাস্টার তৈরি করুন।
2. **Database Access** থেকে একজন ইউজার তৈরি করুন (username + password মনে রাখুন)।
3. **Network Access** থেকে আপনার সার্ভারের IP allow করুন (টেস্টের জন্য সাময়িকভাবে
   `0.0.0.0/0` — "Allow access from anywhere" দিতে পারেন, পরে নির্দিষ্ট IP-তে সীমিত করাই ভালো)।
4. **Connect > Drivers** থেকে কানেকশন স্ট্রিং কপি করুন — এরকম দেখতে হবে:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

## ধাপ ২: প্রজেক্ট সেটআপ
```bash
cd samity-backend
npm install
cp .env.example .env
```
এবার `.env` ফাইলটা খুলে:
- `MONGODB_URI` এ Atlas-এর কানেকশন স্ট্রিং বসান (ডাটাবেজের নাম `samity` রাখতে পারেন, যেমন
  `.../samity?retryWrites=true&w=majority`)
- `JWT_SECRET` এ যেকোনো লম্বা এলোমেলো (random) স্ট্রিং বসান — এটা এডিট-লগইন টোকেন সুরক্ষিত রাখে।

## ধাপ ৩: চালু করা
```bash
npm start
```
টার্মিনালে `MongoDB সংযুক্ত হয়েছে` এবং `সার্ভার চলছে: http://localhost:5000` দেখা গেলে ব্রাউজারে
`http://localhost:5000` খুলুন।

ডেভেলপমেন্টের সময় ফাইল বদলালে অটো-রিস্টার্টের জন্য:
```bash
npm run dev
```

## প্রথমবার ব্যবহার
1. অ্যাপ খুলে উপরে ডান পাশের লক আইকনে চাপুন।
2. প্রথমবার একটা এডিট-পাসওয়ার্ড সেট করতে বলবে — এটা সেট করলেই এডিট মোড চালু হয়ে যাবে।
3. এরপর থেকে যে কেউ লিংকে ঢুকলে সব তথ্য দেখতে পারবে, কিন্তু শুধু সঠিক পাসওয়ার্ড দিয়ে
   লগইন করলেই এডিট (যোগ/পরিবর্তন/মুছে ফেলা) করা যাবে। রিফ্রেশ দিলেও এখন লগইন থেকে যাবে
   (ব্রাউজারে টোকেন সংরক্ষিত থাকে) — লগআউট করতে লক আইকনে আবার চাপুন।

## API সংক্ষেপে
সব রুট `/api` দিয়ে শুরু। GET রুটগুলো পাবলিক (কারো লগইন লাগে না)। POST/PUT/DELETE রুটগুলোতে
`Authorization: Bearer <token>` হেডার লাগবে (লগইন করলে টোকেন পাওয়া যায়)।

| রুট | কাজ |
|---|---|
| `GET/PUT /api/org` | সমিতির তথ্য ও হার |
| `GET/POST/PUT/DELETE /api/guardians` | জিম্মাদার |
| `GET/POST/PUT/DELETE /api/members`, `POST /api/members/bulk` | সদস্য |
| `GET/PUT/DELETE /api/members/:id/entries/:key` | মাসিক/এককালীন জমার এন্ট্রি |
| `GET/POST/DELETE /api/ledger/income`, `/api/ledger/expense` | আয়-ব্যয় |
| `GET/POST/DELETE /api/levies` | বিশেষ এককালীন চাঁদা |
| `GET /api/summary` | মোট জমা, ব্যালেন্স ইত্যাদি সারসংক্ষেপ |
| `POST /api/auth/setup`, `/login`, `/change-password`, `GET /verify`, `/status` | এডিট লগইন |

## হোস্টিং (লাইভ করা)
যেকোনো Node.js হোস্টিং-এ (Render, Railway, Vercel-এর Node adapter, নিজের VPS ইত্যাদি) ডিপ্লয়
করা যাবে — শুধু `MONGODB_URI`, `JWT_SECRET`, `PORT` এনভায়রনমেন্ট ভেরিয়েবল সেট করে দিলেই হবে।
বিল্ড স্টেপ লাগবে না, `npm install && npm start` চালালেই যথেষ্ট।

## প্রজেক্ট কাঠামো
```
samity-backend/
  server.js              ← Express অ্যাপ শুরুর ফাইল
  .env.example           ← এনভায়রনমেন্ট ভেরিয়েবলের নমুনা
  src/
    config/db.js         ← MongoDB কানেকশন
    middleware/auth.js    ← এডিট রুট সুরক্ষা (JWT)
    models/               ← Org, Guardian, Member, Entry, Income, Expense, Levy
    routes/               ← প্রতিটা রিসোর্সের API রুট
  public/
    index.html            ← ফ্রন্টএন্ড (ডিজাইন অপরিবর্তিত, এখন API থেকে ডেটা আনে)
```
