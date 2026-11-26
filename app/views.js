// Hearth Ledger — one renderer per page. All controls actually work.
import { ACCOUNTS, CATEGORIES, GOALS, HOUSEHOLD, INSIGHTS, TRANSACTIONS, TREND } from "./data.js";
import { barsChart, donutChart, trendChart } from "./charts.js";
import { acctById, catById, incomeFor, money, money2, monthLabel, pct, spentByCategory, state, totalSpent } from "./main.js";

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Dashboard ----------
export function renderDashboard(main) {
  const spent = totalSpent("nov");
  const income = incomeFor("nov");
  const left = income - spent;
  const saveRate = (income - spent) / income;
  const totalBudget = CATEGORIES.reduce((a, c) => a + c.budget, 0);
  const budgetHealth = spent / totalBudget;
  const byCat = spentByCategory("nov");
  const slices = CATEGORIES.filter((c) => byCat[c.id] > 0)
    .map((c) => ({ label: c.name, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const recent = state.transactions.slice(0, 6);
  const topGoals = [...GOALS].sort((a, b) => state.goalSaved(b) / b.target - state.goalSaved(a) / a.target).slice(0, 2);

  const page = el(`
    <section>
      <p class="lede">November 2026 · ${esc(HOUSEHOLD.name)} — ${esc(HOUSEHOLD.incomeNote)}.</p>
      <div class="stat-grid">
        <div class="stat-card"><span class="stat-label">Income</span><strong class="stat-num">${money(income)}</strong><span class="stat-sub">this month</span></div>
        <div class="stat-card"><span class="stat-label">Spent</span><strong class="stat-num">${money(spent)}</strong><span class="stat-sub">${pct(budgetHealth)} of the ${money(totalBudget)} budget</span></div>
        <div class="stat-card accent"><span class="stat-label">Left to save</span><strong class="stat-num">${money(left)}</strong><span class="stat-sub">${pct(saveRate)} savings rate</span></div>
        <div class="stat-card"><span class="stat-label">Budget health</span><strong class="stat-num">${budgetHealth <= 1 ? "On track" : "Over budget"}</strong><span class="stat-sub">${CATEGORIES.filter((c) => byCat[c.id] > c.budget).length} categor${CATEGORIES.filter((c) => byCat[c.id] > c.budget).length === 1 ? "y" : "ies"} over budget</span></div>
      </div>

      <div class="two-col">
        <div class="card">
          <h2>Where the money went</h2>
          <div class="donut-wrap"></div>
          <ul class="legend">
            ${slices.slice(0, 6).map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${esc(s.label)}<b>${money(s.value)}</b></li>`).join("")}
          </ul>
          <p class="card-link"><a href="#/transactions">See every transaction →</a></p>
        </div>
        <div class="card">
          <h2>Cash flow — last 6 months</h2>
          <div class="chart-wrap"></div>
          <p class="chart-legend"><span class="key"><i style="background:#1a5c4a"></i>Income</span><span class="key"><i style="background:#d97706"></i>Spending</span></p>
          <p class="muted">November is the lightest spending month so far: $4,645 against $6,850 of income.</p>
        </div>
      </div>

      <h2>Accounts</h2>
      <div class="acct-grid">
        ${ACCOUNTS.map((a) => `
          <div class="acct-card ${a.balance < 0 ? "negative" : ""}">
            <span class="acct-name">${esc(a.name)}</span>
            <strong class="acct-bal">${money(a.balance)}</strong>
            <span class="acct-meta">${esc(a.bank)} · ${esc(a.note)}</span>
          </div>`).join("")}
      </div>

      <div class="two-col">
        <div class="card">
          <h2>Recent transactions</h2>
          <ul class="tx-list">
            ${recent.map((t) => `
              <li><span class="tx-dot" style="background:${catById(t.category).color}"></span>
                <span class="tx-main"><b>${esc(t.merchant)}</b><small>${esc(catById(t.category).name)} · ${esc(t.date.slice(5))}</small></span>
                <b class="tx-amt">${money2(t.amount)}</b></li>`).join("")}
          </ul>
          <p class="card-link"><a href="#/transactions">All ${state.transactions.length} transactions →</a></p>
        </div>
        <div class="card">
          <h2>Goals — closest first</h2>
          ${topGoals.map((g) => {
            const saved = state.goalSaved(g);
            const p = Math.min(100, (saved / g.target) * 100);
            return `<div class="goal-mini">
              <div class="goal-head"><b>${esc(g.name)}</b><span>${money(saved)} of ${money(g.target)}</span></div>
              <div class="bar"><i style="width:${p.toFixed(1)}%"></i></div>
              <small class="muted">${p.toFixed(0)}% · target ${esc(g.targetDate)}</small>
            </div>`;
          }).join("")}
          <p class="card-link"><a href="#/goals">All goals →</a></p>
        </div>
      </div>
    </section>`);
  main.replaceChildren(page);
  page.querySelector(".donut-wrap").appendChild(donutChart(slices));
  page.querySelector(".chart-wrap").appendChild(barsChart(TREND.map((r) => ({ label: r.month, income: r.income, spending: r.spending }))));
}

// ---------- Transactions ----------
let txFilter = { category: "all", account: "all", q: "", sort: "date-desc" };

export function renderTransactions(main) {
  const page = el(`
    <section>
      <p class="lede">Every dollar in and out, November 2026. Add a transaction and the totals update everywhere.</p>
      <div class="card filter-bar">
        <label>Category
          <select id="f-cat">
            <option value="all">All categories</option>
            ${CATEGORIES.map((c) => `<option value="${c.id}" ${txFilter.category === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
          </select>
        </label>
        <label>Account
          <select id="f-acct">
            <option value="all">All accounts</option>
            ${ACCOUNTS.map((a) => `<option value="${a.id}" ${txFilter.account === a.id ? "selected" : ""}>${esc(a.name)}</option>`).join("")}
          </select>
        </label>
        <label class="grow">Search
          <input id="f-q" type="search" placeholder="Merchant or note…" value="${esc(txFilter.q)}">
        </label>
        <label>Sort
          <select id="f-sort">
            <option value="date-desc" ${txFilter.sort === "date-desc" ? "selected" : ""}>Newest first</option>
            <option value="date-asc" ${txFilter.sort === "date-asc" ? "selected" : ""}>Oldest first</option>
            <option value="amount-desc" ${txFilter.sort === "amount-desc" ? "selected" : ""}>Largest amount</option>
            <option value="amount-asc" ${txFilter.sort === "amount-asc" ? "selected" : ""}>Smallest amount</option>
          </select>
        </label>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="tx-table">
            <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Account</th><th class="num">Amount</th></tr></thead>
            <tbody id="tx-body"></tbody>
          </table>
          <p class="empty hidden" id="tx-empty">No transactions match these filters.</p>
        </div>
        <p class="totals" id="tx-totals"></p>
      </div>

      <div class="card">
        <h2>Add a transaction</h2>
        <form id="add-tx" class="add-form">
          <label>Date <input type="date" name="date" value="2026-11-29" required></label>
          <label>Merchant <input type="text" name="merchant" placeholder="e.g. GreenMart" maxlength="60" required></label>
          <label>Category
            <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select>
          </label>
          <label>Account
            <select name="account">${ACCOUNTS.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join("")}</select>
          </label>
          <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
          <label class="grow">Note <input type="text" name="note" placeholder="Optional" maxlength="80"></label>
          <button type="submit" class="btn">Add transaction</button>
        </form>
        <p class="muted" id="add-confirm" role="status"></p>
      </div>
    </section>`);
  main.replaceChildren(page);

  const body = page.querySelector("#tx-body");
  const totals = page.querySelector("#tx-totals");
  const empty = page.querySelector("#tx-empty");

  function applyFilters() {
    let list = state.transactions.slice();
    if (txFilter.category !== "all") list = list.filter((t) => t.category === txFilter.category);
    if (txFilter.account !== "all") list = list.filter((t) => t.account === txFilter.account);
    if (txFilter.q.trim()) {
      const q = txFilter.q.trim().toLowerCase();
      list = list.filter((t) => (t.merchant + " " + (t.note || "")).toLowerCase().includes(q));
    }
    const s = txFilter.sort;
    list.sort((a, b) =>
      s === "date-asc" ? (a.date < b.date ? -1 : 1)
      : s === "amount-desc" ? b.amount - a.amount
      : s === "amount-asc" ? a.amount - b.amount
      : (a.date < b.date ? 1 : -1));
    body.innerHTML = list.map((t) => `<tr>
      <td>${esc(t.date)}</td><td><b>${esc(t.merchant)}</b>${t.note ? `<br><small class="muted">${esc(t.note)}</small>` : ""}</td>
      <td><span class="cat-chip" style="--chip:${catById(t.category).color}">${esc(catById(t.category).name)}</span></td>
      <td>${esc(acctById(t.account).name)}</td><td class="num">${money2(t.amount)}</td></tr>`).join("");
    empty.classList.toggle("hidden", list.length > 0);
    const sum = list.reduce((a, t) => a + t.amount, 0);
    totals.textContent = `${list.length} transaction${list.length === 1 ? "" : "s"} · total ${money2(sum)}`;
  }

  page.querySelector("#f-cat").addEventListener("change", (e) => { txFilter.category = e.target.value; applyFilters(); });
  page.querySelector("#f-acct").addEventListener("change", (e) => { txFilter.account = e.target.value; applyFilters(); });
  page.querySelector("#f-q").addEventListener("input", (e) => { txFilter.q = e.target.value; applyFilters(); });
  page.querySelector("#f-sort").addEventListener("change", (e) => { txFilter.sort = e.target.value; applyFilters(); });

  page.querySelector("#add-tx").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const tx = {
      id: "u" + Date.now(),
      date: fd.get("date"),
      merchant: fd.get("merchant").trim(),
      category: fd.get("category"),
      account: fd.get("account"),
      amount: Math.round(Number(fd.get("amount")) * 100) / 100,
      note: (fd.get("note") || "").trim(),
    };
    if (!tx.merchant || !(tx.amount > 0)) return;
    state.addTransaction(tx);
    applyFilters();
    const c = page.querySelector("#add-confirm");
    c.textContent = `Added: ${tx.merchant} — ${money2(tx.amount)} on ${tx.date}. Saved on this device.`;
    e.target.reset();
    e.target.querySelector('[name="date"]').value = "2026-11-29";
  });

  applyFilters();
}

// ---------- Budget ----------
let budgetMonth = "nov";

export function renderBudget(main) {
  const page = el(`
    <section>
      <p class="lede">A plan for every dollar. Switch months to compare October's actuals with November's.</p>
      <div class="month-switch" role="group" aria-label="Month">
        <button type="button" data-month="oct" class="${budgetMonth === "oct" ? "active" : ""}">October 2026</button>
        <button type="button" data-month="nov" class="${budgetMonth === "nov" ? "active" : ""}">November 2026</button>
      </div>
      <div id="budget-body"></div>
    </section>`);
  main.replaceChildren(page);

  function draw() {
    const spent = spentByCategory(budgetMonth);
    const income = incomeFor(budgetMonth);
    const totalBudget = CATEGORIES.reduce((a, c) => a + c.budget, 0);
    const totalSpent = Object.values(spent).reduce((a, b) => a + b, 0);
    const over = CATEGORIES.filter((c) => spent[c.id] > c.budget);
    const body = page.querySelector("#budget-body");
    body.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><span class="stat-label">Income · ${esc(monthLabel(budgetMonth))}</span><strong class="stat-num">${money(income)}</strong></div>
        <div class="stat-card"><span class="stat-label">Spent</span><strong class="stat-num">${money(totalSpent)}</strong><span class="stat-sub">${pct(totalSpent / totalBudget)} of the ${money(totalBudget)} plan</span></div>
        <div class="stat-card ${totalSpent > totalBudget ? "" : "accent"}"><span class="stat-label">Remaining</span><strong class="stat-num">${money(totalBudget - totalSpent)}</strong><span class="stat-sub">${over.length} categor${over.length === 1 ? "y" : "ies"} over budget</span></div>
      </div>
      <div class="card">
        <h2>Category budgets — ${esc(monthLabel(budgetMonth))}</h2>
        <ul class="budget-list">
          ${CATEGORIES.map((c) => {
            const s = spent[c.id];
            const p = Math.min(100, (s / c.budget) * 100);
            const diff = c.budget - s;
            return `<li>
              <div class="budget-head"><b>${esc(c.name)}</b><span>${money(s)} of ${money(c.budget)}</span></div>
              <div class="bar ${s > c.budget ? "over" : ""}"><i style="width:${p.toFixed(1)}%;background:${s > c.budget ? "#dc2626" : c.color}"></i></div>
              <small class="${diff < 0 ? "over-text" : "muted"}">${diff < 0 ? `${money(-diff)} over budget` : `${money(diff)} left · ${p.toFixed(0)}% used`}</small>
            </li>`;
          }).join("")}
        </ul>
      </div>`;
  }

  page.querySelectorAll(".month-switch button").forEach((b) => {
    b.addEventListener("click", () => {
      budgetMonth = b.dataset.month;
      page.querySelectorAll(".month-switch button").forEach((x) => x.classList.toggle("active", x === b));
      draw();
    });
  });
  draw();
}

// ---------- Goals ----------
export function renderGoals(main) {
  const page = el(`
    <section>
      <p class="lede">Four things the Riveras are saving for. Tap “Add $50” and watch the bar move — it is saved on this device.</p>
      <div class="goal-grid" id="goal-grid"></div>
    </section>`);
  main.replaceChildren(page);

  function draw() {
    const grid = page.querySelector("#goal-grid");
    grid.innerHTML = GOALS.map((g) => {
      const saved = state.goalSaved(g);
      const p = Math.min(100, (saved / g.target) * 100);
      const remaining = Math.max(0, g.target - saved);
      return `<div class="card goal-card">
        <div class="goal-head"><h2>${esc(g.name)}</h2><span class="goal-pct">${p.toFixed(0)}%</span></div>
        <p class="muted">${esc(g.note)}</p>
        <div class="bar big"><i style="width:${p.toFixed(1)}%"></i></div>
        <p class="goal-nums"><strong>${money(saved)}</strong> saved of ${money(g.target)} · <strong>${money(remaining)}</strong> to go · target ${esc(g.targetDate)}</p>
        <div class="goal-actions">
          <button type="button" class="btn" data-goal="${g.id}" data-amount="50">Add $50</button>
          <button type="button" class="btn ghost" data-goal="${g.id}" data-amount="100">Add $100</button>
        </div>
      </div>`;
    }).join("");
    grid.querySelectorAll("button[data-goal]").forEach((b) => {
      b.addEventListener("click", () => {
        state.contribute(b.dataset.goal, Number(b.dataset.amount));
        draw();
      });
    });
  }
  draw();
}

// ---------- Reports ----------
export function renderReports(main) {
  const byCat = spentByCategory("nov");
  const top = CATEGORIES.filter((c) => byCat[c.id] > 0)
    .map((c) => ({ ...c, spent: byCat[c.id] }))
    .sort((a, b) => b.spent - a.spent);
  const total = top.reduce((a, c) => a + c.spent, 0);

  const page = el(`
    <section>
      <p class="lede">Six months of income against spending, and what the numbers are actually saying.</p>
      <div class="card">
        <h2>Income vs spending — Jun to Nov 2026</h2>
        <div class="chart-wrap"></div>
        <p class="chart-legend"><span class="key"><i style="background:#1a5c4a"></i>Income</span><span class="key"><i style="background:#d97706"></i>Spending</span></p>
      </div>
      <div class="two-col">
        <div class="card">
          <h2>November by category</h2>
          <ul class="budget-list compact">
            ${top.map((c) => {
              const p = (c.spent / total) * 100;
              return `<li>
                <div class="budget-head"><b>${esc(c.name)}</b><span>${money(c.spent)} · ${p.toFixed(1)}%</span></div>
                <div class="bar"><i style="width:${p.toFixed(1)}%;background:${c.color}"></i></div>
              </li>`;
            }).join("")}
          </ul>
          <p class="muted">Housing is the biggest share at ${pct(top[0].spent / total)} of November spending — rent is fixed, so the lever is everywhere else.</p>
        </div>
        <div class="card">
          <h2>What we noticed</h2>
          ${INSIGHTS.map((s) => `<h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>`).join("")}
        </div>
      </div>
      <div class="card">
        <h2>Spending trend</h2>
        <div class="trend-wrap"></div>
        <p class="muted">Monthly spending, June to November. November's $4,645 is the lowest of the six months — the Thanksgiving grocery run was planned, and no big surprises hit the card.</p>
      </div>
    </section>`);
  main.replaceChildren(page);
  page.querySelector(".chart-wrap").appendChild(barsChart(TREND.map((r) => ({ label: r.month, income: r.income, spending: r.spending }))));
  page.querySelector(".trend-wrap").appendChild(trendChart(TREND.map((r) => ({ label: r.month, spending: r.spending }))));
}
