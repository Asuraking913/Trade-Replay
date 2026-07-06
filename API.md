# Trade Replay — Backend API

Base URL: `http://127.0.0.1:8000/api` (frontend: `BASE_URL` in `lib/api.ts`).

Auth: DRF token — send `Authorization: Token <token>` on protected routes.
The frontend stores the token in `localStorage` under `tradeplay-token`
(`lib/request.ts`).

---

## 🔐 Auth (`accounts`)

### `POST /api/auth/register/` — public
Create a user and get a token.
```jsonc
// request
{ "username": "alice", "email": "a@x.com", "password": "Str0ngPass!99" }
// 201
{ "token": "dc3f2a…", "user": { "id": 3, "username": "alice", "email": "a@x.com" } }
```
Errors: `400` — `{"username": ["A user with that username already exists."]}` or `{"password": ["This password is too short.", …]}`

### `POST /api/auth/login/` — public
```jsonc
// request
{ "username": "alice", "password": "Str0ngPass!99" }
// 200
{ "token": "dc3f2a…", "user": { "id": 3, "username": "alice", "email": "a@x.com" } }
// 401
{ "detail": "Invalid credentials." }
```

### `GET /api/auth/me/` — token required
```jsonc
// 200
{ "id": 3, "username": "alice", "email": "a@x.com" }   // 401 if no/invalid token
```

### `POST /api/auth/logout/` — token required
Deletes the current token (client should discard it too). → `204 No Content`

---

## 📓 Journal (`journal`) — all token required

### `GET /api/journal/`
Returns the current user's entries, newest first (only their own).
```jsonc
// 200
[
  {
    "id": "446af99e-80f6-40bb-98c4-0a55de7833d8",
    "symbol": "ETH/USD",
    "direction": "short",
    "entry": "3500.00000000",
    "stop": "3600.00000000",
    "target": "3200.00000000",
    "confidence": 7,
    "setups": ["Resistance"],
    "emotion": "focused",
    "thesis": "Rejected supply zone.",
    "riskReward": 3.0,           // derived (reward/risk), null if any price missing
    "createdAt": "2026-07-06T00:48:11.165052Z"
  }
]
```

### `POST /api/journal/`
Creates an entry owned by the authenticated user.
```jsonc
// request  (id, riskReward, createdAt are server-generated — don't send them)
{
  "symbol": "btc/usd",          // required; stored uppercased -> "BTC/USD"
  "direction": "long",          // required; "long" | "short"
  "entry": "65000",             // optional (decimal string or number)
  "stop": "64000",              // optional
  "target": "68000",            // optional
  "confidence": 8,              // optional, 1–10, default 5
  "setups": ["Breakout"],       // optional, default []; values from the tag list below
  "emotion": "confident",       // optional; one of the emotion keys below, or null
  "thesis": "Reclaimed range high on volume."  // required, non-blank
}
// 201 -> the created entry (same shape as GET item)
```
Validation errors → `400`, e.g.:
- `{"setups": ["Invalid setup tag(s): NotATag."]}`
- `{"thesis": ["This field may not be blank."]}`
- `{"confidence": ["Ensure this value is less than or equal to 10."]}`
- `{"direction": ["\"buy\" is not a valid choice."]}`

### `DELETE /api/journal/{id}/`
Deletes one of the user's entries. → `204`, or `404 {"detail": "Not found."}` if it isn't theirs / doesn't exist.

### Enum values
- **direction:** `long`, `short`
- **emotion:** `calm`, `confident`, `focused`, `excited`, `unsure`, `anxious`, `fomo`, `revenge` (or `null`)
- **setups tags:** `Breakout`, `Pullback`, `Support`, `Resistance`, `Trend continuation`, `Reversal`, `Range`, `Liquidity grab`, `Order block`, `Supply/Demand`, `News catalyst`, `Fib retrace`, `Moving average`, `Double top/bottom`

---

## 📈 Chart data (`chart`) — public, read-only

### `GET /api/candles/{symbol}/`
`symbol` is URL-path style incl. the slash, e.g. `/api/candles/BTC/USD/`.

Query params:
| Param | Default | Notes |
|-------|---------|-------|
| `timeframe` | `1day` | one of `1min`,`5min`,`15min`,`1h`,`4h`,`1day` |
| `limit` | 1500–2000 by tf | max `5000` |
| `before` | — | ISO datetime, e.g. `2025-06-01T00:00:00Z`; returns bars strictly older (scroll-back paging) |

```jsonc
// 200
{
  "symbol": "BTC/USD",
  "timeframe": "1day",
  "candles": [ { "time": "2025-06-01", "open": "…", "high": "…", "low": "…", "close": "…", "volume": 12345 } ],
  "hasMore": true,          // are there older bars beyond this page?
  "oldestTime": "2025-06-01"
}
```
`time` is a date string (`YYYY-MM-DD`) for `1day`, otherwise ISO `YYYY-MM-DDTHH:MM:SSZ`. Errors: `400` invalid timeframe/limit/before, `404` symbol not found.

### `GET /api/symbols/{symbol}/`
Symbol detail with pre-formatted display strings.
```jsonc
// 200
{
  "symbol": "BTC/USD", "name": "…", "exchange": "…", "type": "…", "subtype": "",
  "price": "65,000.000", "currency": "USD",
  "change": "+1,200.000", "changePercent": "+1.88%", "isPositive": true,
  "marketOpen": true, "newsHeadline": "", "newsTime": "",
  "performance": [ { "label": "1W", "value": "+3.20%", "isPositive": true }, /* 1M, 3M */ ]
}
// 404 if symbol or candle data missing
```

### `GET /api/watchlist/`
Grouped by section, in fixed order (`INDICES, STOCKS, FUTURES, FOREX, CRYPTO, OTHER`).
```jsonc
// 200
[
  { "name": "CRYPTO", "expanded": true, "items": [
      { "symbol": "BTC/USD", "iconColor": "#f7931a", "iconLabel": "B",
        "last": "65,000.000", "change": "+1,200.000", "changePercent": "+1.88%", "isPositive": true }
  ]}
]
```

### `GET /api/search/?q=btc`
Up to 25 matches (symbol contains `q`); each item has the same shape as a watchlist `item`. Empty `q` returns the first 25.
