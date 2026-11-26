// Hearth Ledger — router, shared helpers, and persisted state (localStorage).
import { ACCOUNTS, CATEGORIES, GOALS, HOUSEHOLD, INSIGHTS, OCTOBER_INCOME, OCTOBER_SPENT, TRANSACTIONS, TREND } from "./data.js";
import { renderBudget, renderDashboard, renderGoals, renderReports, renderTransactions } from "./views.js";

export const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
export const money2 = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pct = (n) => Math.round(n * 100) + "%";
export const catById = (id) => CATEGORIES.find((c) => c.id === id) || { name: id, color: "#6b7280", budget: 0 };
export const acctById = (id) => ACCOUNTS.find((a) => a.id === id) || { name: id };

const LS_TX = "hearth-ledger-added-transactions-v1";
const LS_GOALS = "hearth-ledger-goal-extra-v1";

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function writeLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* private mode: keep in memory only */ }
}

// State: base transactions + user-added ones; goal contributions on top of base saved amounts.
export const state = {
  get transactions() {
    const added = readLS(LS_TX);
    return [...TRANSACTIONS, ...added].sort((a, b) => (a.date < b.date ? 1 : -1));
  },
  addTransaction(tx) {
    const added = readLS(LS_TX);
    added.push(tx);
    writeLS(LS_TX, added);
  },
  get goalExtra() {
    const extra = {};
    for (const g of readLS(LS_GOALS)) extra[g.id] = (extra[g.id] || 0) + g.amount;
    return extra;
  },
  contribute(goalId, amount) {
    const list = readLS(LS_GOALS);
    list.push({ id: goalId, amount, at: new Date().toISOString() });
    writeLS(LS_GOALS, list);
  },
  goalSaved(goal) {
    return goal.saved + (this.goalExtra[goal.id] || 0);
  },
};

// Spending per category for a month. "nov" sums transactions; "oct" uses October actuals.
export function spentByCategory(month) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  if (month === "oct") {
    for (const [id, v] of Object.entries(OCTOBER_SPENT)) out[id] = v;
    return out;
  }
  for (const t of state.transactions) out[t.category] = (out[t.category] || 0) + t.amount;
  return out;
}
export function totalSpent(month) {
  return Object.values(spentByCategory(month)).reduce((a, b) => a + b, 0);
}
export function incomeFor(month) {
  return month === "oct" ? OCTOBER_INCOME : HOUSEHOLD.incomeMonthly;
}
export function monthLabel(month) {
  return month === "oct" ? "October 2026" : "November 2026";
}

// ---------- Router ----------
const ROUTES = {
  "/": { title: "Dashboard", render: renderDashboard },
  "/transactions": { title: "Transactions", render: renderTransactions },
  "/budget": { title: "Budget", render: renderBudget },
  "/goals": { title: "Goals", render: renderGoals },
  "/reports": { title: "Reports", render: renderReports },
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : "/";
}

export function render() {
  const route = currentRoute();
  const main = document.getElementById("app");
  ROUTES[route].render(main);
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const path = href.replace(/^#/, "") || "/";
    a.classList.toggle("active", path === route);
    if (path === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const title = document.getElementById("page-title");
  if (title) title.textContent = ROUTES[route].title;
  document.title = `${ROUTES[route].title} — Hearth Ledger`;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
document.addEventListener("DOMContentLoaded", render);
