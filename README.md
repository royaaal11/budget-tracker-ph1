# Vault — personal finance tracker

Budget tracker, expense tracker and savings tracker on a **bank-card interface**.
Every card is its own mini tracker: its own balance, its own budget, its own
expense log. Tap a card to flip it and see what's inside.

![no build step](https://img.shields.io/badge/build-none-informational)

## Features

**Cards**
- Add as many bank/e-wallet cards as you like — GCash, GoTyme, BDO, whatever you use
- Each card gets a custom name, one of 10 card themes, and a balance
- Cards render as real plastic: chip, masked number, cardholder, valid-thru, gloss, magstripe
- Click, tap, or press <kbd>Enter</kbd>/<kbd>Space</kbd> to flip front ↔ back with a 3D animation
- **Front** — bank name, card type badge, masked number, card furniture
- **Back** — the live balance in that card, plus its budget or goal meter
- Edit any card's name, theme, type, balance, budget and goal; delete cards you're done with

**Budget & expenses, per card**
- Every card has its own budget and its own expense log — not one shared pool
- Logging an expense subtracts from *that card's* balance immediately
- 9 expense categories (Food & Drink, Groceries, Transport, Bills, Shopping, Health,
  Entertainment, Transfers & Fees, Other) and 8 income categories
- Budgets can reset monthly or run for the card's lifetime
- Status reads **On track → Nearly spent → Over budget**, always with an icon and a label
- Per-card spending-by-category breakdown, plus a filterable transaction history
- "Add funds" tops a spending card back up

**Savings cards**
- Mark a card as **Savings** and money added counts as a *deposit* that grows the balance
- Set an optional savings goal to get a progress bar and a **Goal reached** state
- Withdrawals are still available when you need to dip into it

**Overview**
- Hero total balance across every card
- Total spent (with this month called out), total saved, and budget left
- Recent activity across all cards

**Persistence & resets**
- Everything saves to the browser automatically on every change — nothing resets between sessions
- Open tabs stay in sync with each other
- Export / import a JSON backup
- Clear one card's history (restoring its balance), delete a single card, or erase everything

**Also**
- Light and dark themes
- 18 currencies, defaulting to PHP
- Keyboard accessible; respects `prefers-reduced-motion`
- Responsive from phone to desktop

## Run it

There is no build step. Either open the file directly:

```bash
# macOS / Linux
open index.html
# Windows
start index.html
```

…or serve it with the bundled Express server:

```bash
npm install
npm start
# → http://localhost:3000
```

## Where data lives

Vault keeps its state in the browser's **`localStorage`**, under the key
`vault.finance.v1`. That means:

- it works offline, with no database and no account
- data is per-browser and per-device — it does not follow you to your phone
- clearing site data for this origin erases it, so use **Settings → Export JSON** for backups

If you later want the data on a server instead, `server.js` still exposes the
Postgres-backed API described below; the storage layer in
[`assets/app.js`](assets/app.js) (`load()` / `save()`) is the only thing that
would need to change.

## Layout

| Path | What it is |
|---|---|
| [`index.html`](index.html) | App shell and dialogs |
| [`assets/app.css`](assets/app.css) | Design tokens, card plastic, meters, layout |
| [`assets/app.js`](assets/app.js) | State, persistence, rendering, interactions |
| [`server.js`](server.js) | Static host + the legacy trip-tracker API |
| [`trip_budget_tracker.html`](trip_budget_tracker.html) | The previous single-budget tracker, kept at `/trip` |

## Design notes

Colour and chart decisions follow a validated data-visualisation palette rather
than taste:

- The category breakdown is a **single sequential hue**, because it encodes one
  measure (spend) across categories — the category name is the identity channel,
  so no categorical palette is needed and none is shipped.
- Anything past six categories folds into one "N more categories" bar rather
  than growing the hue count.
- Meters are tone-on-tone: the track is a step of the fill's own hue.
- Status states (`On track` / `Nearly spent` / `Over budget` / `Goal reached`)
  always pair colour with an icon **and** a text label, so meaning is never
  carried by colour alone.
- Exactly one hero figure per view (total balance); everything else is a stat tile.

## Legacy API (trip tracker)

`server.js` still serves the older tracker at `/trip` and its API. These need a
PostgreSQL database via `DATABASE_URL`; the card app does not, and the server
starts fine without one.

- `GET /api/data` — get budget and expenses
- `POST /api/budget` — set budget amount
- `POST /api/expense` — add an expense
- `DELETE /api/expense/:id` — delete an expense
- `POST /api/reset` — clear all data

```
DATABASE_URL=postgresql://localhost/budget_tracker
```

## Deploying

The app is static, so any static host works. On Vercel the repo deploys as-is
(`vercel.json` is already present) — `DATABASE_URL` is only needed if you also
want the `/trip` legacy tracker to work.
