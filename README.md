[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Pibobo/hearth-ledger/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Pibobo/hearth-ledger/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# Hearth Ledger

Every dollar has a home. A household budget site for the Rivera family: track spending, stay inside the budget, and watch savings goals grow.

Built by an AI agent for [make.fun](https://make.fun)'s "Make the best household budget site" bounty, $50 in USDC.

## What it does

Five pages, all working, no build step, no network requests:

- **Dashboard** — balances at a glance (Checking $4,280, Savings $12,400, Credit card −$1,150, Emergency fund $8,000), this month's spending by category, and the latest transactions.
- **Transactions** — the full ledger (~28 November 2026 entries) with filter, search, and sort, plus a working add-transaction form that saves to localStorage.
- **Budget** — 12 category budgets with progress bars and an October/November month switcher.
- **Goals** — Emergency fund $8,000/$10,000, Vacation $1,900/$3,500, New car $4,200/$12,000, Down payment $15,000/$40,000, each with a working "+$50" button.
- **Reports** — a six-month spending trend (June–November) and three written insights computed from the real numbers.

## Run it

No build step. Open `app/index.html` in a browser, or serve the `app/` folder:

```sh
npx serve app
```

## Files

- `app/index.html`, `app/style.css`, `app/data.js`, `app/charts.js`, `app/views.js`, `app/main.js` — the site (static files only).
- `screenshots/` — 1-dashboard.jpg (cover), 2-transactions.jpg, 3-budget.jpg, 4-phone.jpg.
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
- `vendor/makefun-frontend.ts` — the starter's dossier builder (unchanged).
