// Hearth Ledger — data for the fictional Rivera family, November 2026.
// Every figure is invented for this demo; no real person's data is used.
export const HOUSEHOLD = {
  name: "The Rivera Family",
  month: "November 2026",
  incomeMonthly: 6850,
  incomeNote: "Two salaries — Maya (nurse) $3,900, Daniel (teacher) $2,950",
};

export const ACCOUNTS = [
  { id: "checking", name: "Everyday Checking", bank: "First Community Bank", balance: 4280, note: "Bills & daily spending" },
  { id: "savings", name: "High-Yield Savings", bank: "First Community Bank", balance: 12400, note: "Rainy-day fund" },
  { id: "credit", name: "Maple Rewards Card", bank: "Maple Credit Union", balance: -1150, note: "Due Dec 5 — pay in full" },
  { id: "emergency", name: "Emergency Fund", bank: "First Community Bank", balance: 8000, note: "4 months of essentials" },
];

export const CATEGORIES = [
  { id: "housing", name: "Housing", budget: 1850, color: "#14532d" },
  { id: "groceries", name: "Groceries", budget: 620, color: "#2e7d4f" },
  { id: "dining", name: "Dining Out", budget: 240, color: "#d97706" },
  { id: "transport", name: "Transport", budget: 380, color: "#2563eb" },
  { id: "utilities", name: "Utilities", budget: 210, color: "#7c3aed" },
  { id: "insurance", name: "Insurance", budget: 310, color: "#0e7490" },
  { id: "entertainment", name: "Entertainment", budget: 150, color: "#db2777" },
  { id: "health", name: "Health", budget: 180, color: "#dc2626" },
  { id: "shopping", name: "Shopping", budget: 220, color: "#65a30d" },
  { id: "savings", name: "Savings", budget: 900, color: "#1a5c4a" },
  { id: "kids", name: "Kids", budget: 350, color: "#ea580c" },
  { id: "pets", name: "Pets", budget: 80, color: "#0891b2" },
];

// November 2026 transactions (28). Amounts are expenses; Savings is a transfer to savings.
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", merchant: "Riverside Apartments", category: "housing", account: "checking", amount: 1850.00, note: "November rent" },
  { id: "t02", date: "2026-11-02", merchant: "GreenMart", category: "groceries", account: "checking", amount: 86.40, note: "Weekly shop" },
  { id: "t03", date: "2026-11-03", merchant: "BlueBird Cafe", category: "dining", account: "credit", amount: 24.50, note: "Lunch with Maya" },
  { id: "t04", date: "2026-11-04", merchant: "Sunoco Station", category: "transport", account: "credit", amount: 120.00, note: "Fuel — family car" },
  { id: "t05", date: "2026-11-05", merchant: "City Power & Light", category: "utilities", account: "checking", amount: 98.45, note: "October electric bill" },
  { id: "t06", date: "2026-11-06", merchant: "GreenMart", category: "groceries", account: "checking", amount: 74.20, note: "Weekly shop" },
  { id: "t07", date: "2026-11-07", merchant: "Northgate Cinema", category: "entertainment", account: "credit", amount: 42.00, note: "Family movie night" },
  { id: "t08", date: "2026-11-08", merchant: "Harbor Insurance", category: "insurance", account: "checking", amount: 310.00, note: "Home + auto premium" },
  { id: "t09", date: "2026-11-09", merchant: "GreenMart", category: "groceries", account: "checking", amount: 92.15, note: "Weekly shop" },
  { id: "t10", date: "2026-11-10", merchant: "Metro Transit", category: "transport", account: "checking", amount: 45.00, note: "Monthly bus pass" },
  { id: "t11", date: "2026-11-11", merchant: "Pine Street Pharmacy", category: "health", account: "checking", amount: 35.00, note: "Prescriptions" },
  { id: "t12", date: "2026-11-12", merchant: "Noodle House", category: "dining", account: "credit", amount: 38.75, note: "Takeout dinner" },
  { id: "t13", date: "2026-11-13", merchant: "Maple & Main Outfitters", category: "shopping", account: "credit", amount: 54.99, note: "Winter jackets — kids" },
  { id: "t14", date: "2026-11-14", merchant: "GreenMart", category: "groceries", account: "checking", amount: 58.90, note: "Weekly shop" },
  { id: "t15", date: "2026-11-15", merchant: "Automatic Transfer", category: "savings", account: "checking", amount: 900.00, note: "Monthly savings transfer" },
  { id: "t16", date: "2026-11-16", merchant: "Sunoco Station", category: "transport", account: "credit", amount: 62.40, note: "Fuel — family car" },
  { id: "t17", date: "2026-11-17", merchant: "ClearWater Utility", category: "utilities", account: "checking", amount: 64.20, note: "Water bill" },
  { id: "t18", date: "2026-11-18", merchant: "Riverside Dental", category: "health", account: "checking", amount: 60.00, note: "Checkup copay — Leo" },
  { id: "t19", date: "2026-11-19", merchant: "The Rustic Table", category: "dining", account: "credit", amount: 42.30, note: "Anniversary dinner" },
  { id: "t20", date: "2026-11-20", merchant: "GreenMart", category: "groceries", account: "checking", amount: 110.35, note: "Thanksgiving groceries" },
  { id: "t21", date: "2026-11-21", merchant: "StreamBox", category: "entertainment", account: "credit", amount: 15.99, note: "Monthly streaming" },
  { id: "t22", date: "2026-11-22", merchant: "BrightStart Books", category: "kids", account: "credit", amount: 85.00, note: "School books — Sofia" },
  { id: "t23", date: "2026-11-23", merchant: "Trailhead Outdoors", category: "shopping", account: "credit", amount: 89.00, note: "Hiking boots — Daniel" },
  { id: "t24", date: "2026-11-24", merchant: "City School District", category: "kids", account: "checking", amount: 120.00, note: "School lunch program" },
  { id: "t25", date: "2026-11-25", merchant: "Pet Pantry", category: "pets", account: "checking", amount: 42.30, note: "Food & treats — Biscuit" },
  { id: "t26", date: "2026-11-26", merchant: "Corner Bakery", category: "dining", account: "credit", amount: 28.60, note: "Pies for Thanksgiving" },
  { id: "t27", date: "2026-11-27", merchant: "FiberNet", category: "utilities", account: "checking", amount: 52.00, note: "Internet — monthly" },
  { id: "t28", date: "2026-11-28", merchant: "Hearth & Home Store", category: "shopping", account: "credit", amount: 42.75, note: "Thanksgiving tablecloth" },
];

// October 2026 actual spending per category (for the month switcher on Budget).
export const OCTOBER_SPENT = {
  housing: 1850, groceries: 588.40, dining: 262.10, transport: 341.20,
  utilities: 198.75, insurance: 310, entertainment: 132.40, health: 145.00,
  shopping: 268.90, savings: 900, kids: 312.00, pets: 64.00,
};
export const OCTOBER_INCOME = 6850;

export const GOALS = [
  { id: "g1", name: "Emergency Fund", saved: 8000, target: 10000, targetDate: "Mar 2027", note: "4 months of essentials — almost there" },
  { id: "g2", name: "Family Vacation", saved: 1900, target: 3500, targetDate: "Jun 2027", note: "A week at the coast" },
  { id: "g3", name: "New Car", saved: 4200, target: 12000, targetDate: "Dec 2027", note: "Replace the 2012 sedan" },
  { id: "g4", name: "Home Down Payment", saved: 15000, target: 40000, targetDate: "Jun 2029", note: "Saving for our own place" },
];

// Six-month income vs spending (Jun–Nov 2026).
export const TREND = [
  { month: "Jun", income: 6720, spending: 5210 },
  { month: "Jul", income: 6850, spending: 4980 },
  { month: "Aug", income: 6850, spending: 5340 },
  { month: "Sep", income: 6850, spending: 5120 },
  { month: "Oct", income: 6850, spending: 5373 },
  { month: "Nov", income: 6850, spending: 4645 },
];

export const INSIGHTS = [
  {
    title: "Dining is the easiest win",
    body: "Dining out is $134 so far against a $240 budget, but October ran $22 over. Cooking two more nights a week would save roughly $95 a month — enough to finish the vacation fund two months early.",
  },
  {
    title: "Groceries are under control",
    body: "Groceries sit at $422 of the $620 budget with two days left in the month. The Thanksgiving shop ($110) was the biggest single trip; the weekly average of $84 is $12 below the plan.",
  },
  {
    title: "Utilities crept over",
    body: "Utilities total $215 against a $210 budget — $5 over, driven by the electric bill ($98). A shorter shower routine and the new LED bulbs should pull December back under budget.",
  },
];
