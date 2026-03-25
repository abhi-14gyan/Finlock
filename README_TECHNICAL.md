# Finlock — Technical Reference

> A deep-dive into the architecture, data schema, state management, and known technical debt of the Finlock MERN personal finance application.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Database Schema & Collection Relationships](#database-schema--collection-relationships)
3. [Frontend State Management](#frontend-state-management)
4. [Technical Debt & Vibe-Coding Shortcuts](#technical-debt--vibe-coding-shortcuts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Recharts, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (Access + Refresh tokens in httpOnly cookies), Passport.js (Google OAuth) |
| AI | Google Gemini 1.5 Flash (receipt scanning, financial insights) |
| Background Jobs | Inngest (durable cron functions) |
| Email | Nodemailer |
| Security | Arcjet (rate limiting, bot detection, shield) |
| File Upload | Multer (local disk) + Cloudinary |

---

## Database Schema & Collection Relationships

### Collections Overview

```
┌──────────┐       ┌───────────┐       ┌─────────────┐       ┌────────┐
│   User   │──1:N──│  Account  │──1:N──│ Transaction │  1:1  │ Budget │
└──────────┘       └───────────┘       └─────────────┘       └────────┘
     │                                        │
     └──────────────────1:1──────────────────-┘
                   (userId on Transaction)
```

---

### `users` Collection

```js
{
  _id:          ObjectId,        // Primary key
  googleId:     String | null,   // null for email/password users
  email:        String,          // unique, required
  username:     String,          // required
  imageUrl:     String,          // Cloudinary URL or default avatar
  password:     String,          // bcrypt hash; null if googleId is set
  refreshToken: String,          // stored JWT refresh token
  createdAt:    Date,
  updatedAt:    Date
}
```

**Active Record Methods on the Model:**
- `pre("save")` → auto-hashes password with bcrypt if modified
- `isPasswordCorrect(password)` → bcrypt compare
- `generateAccessToken()` → short-lived JWT (payload: `_id`, `email`, `username`)
- `generateRefreshToken()` → long-lived JWT (payload: `_id` only)

---

### `accounts` Collection

```js
{
  _id:       ObjectId,
  name:      String,        // e.g. "HDFC Savings"
  type:      String,        // e.g. "savings", "current", "investment"
  balance:   Decimal128,    // exact decimal — avoids floating-point errors
  isDefault: Boolean,       // only one account per user should be true
  userId:    ObjectId,      // ref → users._id
  createdAt: Date,
  updatedAt: Date
}
```

**Relationship:** One `User` → Many `Account`s. The `userId` field is the foreign key.  
**Business Rule:** Only one account per user can have `isDefault: true`. Enforced in the controller via `updateMany` to clear old default before setting a new one.

---

### `transactions` Collection

```js
{
  _id:               ObjectId,
  type:              String,    // enum: "INCOME" | "EXPENSE"
  amount:            Decimal128,
  description:       String,
  date:              Date,
  category:          String,    // e.g. "groceries", "entertainment"
  receiptUrl:        String,    // optional Cloudinary URL
  isRecurring:       Boolean,
  recurringInterval: String,    // enum: "DAILY" | "WEEKLY" | "MONTHLY"
  nextRecurringDate: Date,      // computed on create/update
  lastProcessed:     Date,
  status:            String,    // enum: "PENDING" | "COMPLETED" | "FAILED"
  userId:            ObjectId,  // ref → users._id
  accountId:         ObjectId,  // ref → accounts._id
  createdAt:         Date,
  updatedAt:         Date
}
```

**Relationship:** One `Account` → Many `Transaction`s. One `User` → Many `Transaction`s directly (denormalized for fast per-user queries without a join through Account).

**Critical Rule:** Every write to `transactions` that changes `amount` **must** also update `accounts.balance` in the **same MongoDB session** (atomic commit/abort).

---

### `budgets` Collection

```js
{
  _id:           ObjectId,
  amount:        Decimal128,
  userId:        ObjectId,  // ref → users._id  ← unique index (1 budget per user)
  lastAlertSent: Date,      // used to prevent duplicate monthly alerts
  createdAt:     Date,
  updatedAt:     Date
}
```

**Relationship:** One `User` → One `Budget` (enforced by `unique: true` on `userId`).  
**Business Logic:** `lastAlertSent` is checked by the Inngest cron every 6 hours. An alert is sent only if `percentageUsed >= 80` AND (no alert sent yet OR last alert was in a previous calendar month).

---

### Relationship Summary

| Relationship | From | To | Cardinality | FK Field |
|---|---|---|---|---|
| User owns Accounts | `users` | `accounts` | 1 : N | `accounts.userId` |
| User owns Transactions | `users` | `transactions` | 1 : N | `transactions.userId` |
| Account holds Transactions | `accounts` | `transactions` | 1 : N | `transactions.accountId` |
| User has Budget | `users` | `budgets` | 1 : 1 | `budgets.userId` (unique) |

> **Note:** There are no `populate()` calls from transactions back to users in most routes — `userId` on Transaction is a denormalization shortcut for efficient queries in background jobs.

---

## Frontend State Management

Finlock uses **local component state + React Context** — no Redux, no Zustand, no external state library.

### Layer 1 — Global Auth State (`AuthContext`)

```
AuthContext.js
  └── AuthProvider wraps entire <App>
        ├── state: { user, checkingAuth }
        ├── on mount: GET /api/v1/users/me → rehydrates session from httpOnly cookie
        └── exported hook: useAuth() → { user, setUser, checkingAuth }
```

`checkingAuth` is `true` during the initial `/me` check. Every protected page renders nothing (or a loader) while this is `true` — preventing the route guard from redirecting before auth is confirmed.

### Layer 2 — Theme State (`ThemeContext` + `useDarkMode` hook)

```
ThemeContext.js  →  provides { theme } object globally
useDarkMode.js   →  hook that reads/writes localStorage + toggles <html> class
```

**Problem identified:** `dashboard.jsx` has its own **local** `isDark` state (`const [isDark, setIsDark] = useState(true)`) instead of consuming `ThemeContext`. This means the theme does not sync between pages. (See Technical Debt section.)

### Layer 3 — Page-Level Local State (per component)

Each page manages its own data independently via `useState` + `useEffect` + direct `axios` calls. No shared data cache exists.

| Page | Local State Variables |
|---|---|
| `dashboard.jsx` | `accounts`, `selectedAccount`, `transactions`, `budgetData`, `loading`, `openDrawer`, `isDark`, `mobileMenuOpen`, `showDropdown` |
| `transaction.jsx` | `accounts`, `initialData`, `loading`, `isDark`, `mobileMenuOpen` |
| `account.jsx` | own account + transactions state |

### Data Fetching Pattern

Every page fetches its own data on mount:

```
useEffect(() => {
  axios.get("/api/v1/...", { withCredentials: true })
    .then(res => setState(res.data.data))
    .catch(err => console.error(err));
}, []);
```

There is **no shared cache** — if you navigate Dashboard → Transaction page → back to Dashboard, accounts are re-fetched from the API from scratch each time.

---

## Technical Debt & Vibe-Coding Shortcuts

These are real issues found in the codebase that **will cause bugs** or **are already causing silent problems**.

---

### 🔴 TD-1 — Hardcoded Dummy Data in Dashboard (Active Bug)

**File:** `dashboard.jsx`, lines 234–243

```js
const expenseData = [
  { name: 'rental', value: 1500.00 },
  { name: 'entertainment', value: 304.33 },
  // ...
];
const budgetUsed = 4217.12;
const budgetTotal = 7000.00;
```

**Problem:** These values are hardcoded constants. The pie chart legend uses these fake numbers, **not the real data from MongoDB**. A new user would see someone else's financial data (fake data) on their dashboard.

**Fix:** Remove `expenseData`, `budgetUsed`, `budgetTotal` constants. The `pieChartData` (which is computed from real transactions) is already correct — it just needs to be wired to the legend too.

---

### 🔴 TD-2 — No Global Error Handler in `app.js`

**File:** `backend/src/app.js`

`asyncHandler` correctly forwards errors with `next(err)`, but there is **no error-handling middleware** (the `(err, req, res, next)` 4-argument form) registered in `app.js`. Unhandled errors fall through to Express's default handler, which:
- Returns a plain-text HTML error page (not JSON)
- Exposes the full stack trace in production

**Fix:** Add at the bottom of `app.js`, after all routes:
```js
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
```

---

### 🟠 TD-3 — `refreshAccessToken` Has a Variable Used Before Declaration

**File:** `backend/src/controllers/user.controller.js`, line 122–123

```js
res.cookie("accessToken", accessToken, options); // ← accessToken used here
const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id); // ← declared here
```

`accessToken` is used **before** it is declared due to a missing `await` reorder. This will throw a `ReferenceError: Cannot access 'accessToken' before initialization` at runtime when a user's token expires and they try to refresh it. The token refresh flow is **currently broken**.

**Fix:** Swap the two lines — declare first, use second.

---

### 🟠 TD-4 — Theme State is Duplicated Across Pages (Desync Bug)

**Files:** `dashboard.jsx` line 18, `transaction.jsx` line 23, `account.jsx`

Each page has `const [isDark, setIsDark] = useState(true)`. Since this is local state, toggling dark mode on the Dashboard resets to light mode when navigating to the Transaction page.

`ThemeContext.js` and `useDarkMode.js` already exist in the codebase to solve this — they just aren't being used in the pages.

**Fix:** Replace all `const [isDark, setIsDark] = useState(true)` instances with `const { theme, toggleTheme } = useTheme()` from `ThemeContext`.

---

### 🟠 TD-5 — `getUserTransactions` Blindly Spreads `req.query` into the DB Query

**File:** `backend/src/controllers/transactions.controller.js`, line 141

```js
const query = { userId, ...req.query };
const transactions = await Transaction.find(query)...
```

Any query parameter a user sends in the URL is passed **directly to MongoDB**. A user could send `?__id[$gt]=0` or `?status=PENDING` and filter transactions they shouldn't see — or worse, trigger a [NoSQL injection](https://owasp.org/www-project-web-security-testing-guide/).

**Fix:** Allowlist specific query params:
```js
const { accountId, type, category } = req.query;
const query = { userId, ...(accountId && { accountId }), ...(type && { type }) };
```

---

### 🟡 TD-6 — No Input Validation on Any Endpoint

No route uses a validation schema (Zod, Joi, express-validator). The backend trusts `req.body` completely. Edge cases that are untested and likely to crash:

| Endpoint | Untested input | Potential crash |
|---|---|---|
| `POST /transaction` | `amount: "hello"` | `Decimal128.fromString` throws |
| `POST /transaction` | `amount: -500` | Negative balance stored silently |
| `POST /dashboard/accounts` | `balance: null` | `isNaN(null)` returns `false` — passes the check |
| `PUT /transaction/:id` | `id: "not-an-objectid"` | Mongoose `CastError` crashes with no clear message |

---

### 🟡 TD-7 — `fetchAccounts` is Called 3 Times on Dashboard Mount

**File:** `dashboard.jsx`

There are three separate `useEffect` hooks that each trigger `fetchAccounts()`:
1. On mount (`[]` dependency)
2. When `user` changes (`[user]` dependency)
3. When `openDrawer` closes (`handleDrawerClose`)

On a fresh page load, this means **2 redundant API calls** to `/api/v1/dashboard/accounts` fire immediately. As user scale grows, this triples read load unnecessarily.

**Fix:** Consolidate into a single `useEffect([])` and expose a manual `refresh` callback for the drawer close case only.

---

### 🟡 TD-8 — `console.log` Statements Left in Production Code

Found in: `dashboard.jsx`, `actions/budgetAlert.js` (debug logs with emoji), `account.controller.js`, `transactions.controller.js`.

`budgetAlert.js` in particular logs sensitive intermediate data:
```js
console.log("User Email:", user.email);
console.log("Percentage Used:", percentageUsed + "%");
```

This is acceptable during development but leaks user PII to server logs in production.

**Fix:** Replace with a proper logger (e.g. `winston` or `pino`) with log levels, or remove before production deployment.

---

### Summary Table

| ID | Severity | File | Issue |
|---|---|---|---|
| TD-1 | 🔴 Bug | `dashboard.jsx` | Hardcoded fake expense data shown to all users |
| TD-2 | 🔴 Bug | `app.js` | No global error handler — stack traces leak in prod |
| TD-3 | 🔴 Bug | `user.controller.js` | `refreshAccessToken` crashes — variable used before declaration |
| TD-4 | 🟠 UX | Multiple pages | Theme state desync — dark mode resets on navigation |
| TD-5 | 🟠 Security | `transactions.controller.js` | `req.query` spread into MongoDB query — NoSQL injection risk |
| TD-6 | 🟡 Stability | All controllers | No input validation — bad payloads crash with unreadable errors |
| TD-7 | 🟡 Performance | `dashboard.jsx` | `fetchAccounts` called 3× on mount — redundant API calls |
| TD-8 | 🟡 Privacy | Multiple files | `console.log` with user PII/financial data in production code |

---

*Generated by architectural scan — March 2026*
