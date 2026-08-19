// In-memory expense store. Good enough while the service is single-instance;
// the plan is to move this behind a repository interface backed by Postgres.

let sequence = 9;

const expenses = [
  {
    id: 1,
    description: "Team lunch after the release",
    vendor: "Cafe Nero",
    category: "meals",
    amount: 84.2,
    date: "2026-03-02T12:40:00.000Z",
  },
  {
    id: 2,
    description: "Cloud hosting - February",
    vendor: "Render",
    category: "infrastructure",
    amount: 219,
    date: "2026-03-03T00:05:00.000Z",
  },
  {
    id: 3,
    description: "Design tool seats",
    vendor: "Figma",
    category: "software",
    amount: 135,
    date: "2026-03-07T08:00:00.000Z",
  },
  {
    id: 4,
    description: "Taxi to the customer workshop",
    vendor: "Bolt",
    category: "travel",
    amount: 27.5,
    date: "2026-03-11T07:22:00.000Z",
  },
  {
    id: 5,
    description: "Error tracking subscription",
    vendor: "Sentry",
    category: "software",
    amount: 89,
    date: "2026-03-14T09:30:00.000Z",
  },
  {
    id: 6,
    description: "Office coffee restock",
    vendor: "Beanroom",
    category: "office",
    amount: 46.75,
    date: "2026-03-14T15:10:00.000Z",
  },
  {
    id: 7,
    description: "Conference ticket",
    vendor: "JSConf",
    category: "travel",
    amount: 410,
    date: "2026-03-19T10:00:00.000Z",
  },
  {
    id: 8,
    description: "Cloud hosting - March",
    vendor: "Render",
    category: "infrastructure",
    amount: 241.3,
    date: "2026-03-31T00:05:00.000Z",
  },
];

export function allExpenses() {
  return expenses;
}

export function filterExpenses({ from, to, category, vendor } = {}) {
  return expenses.filter((expense) => {
    if (from && expense.date < from) return false;
    if (to && expense.date > to) return false;
    if (category && expense.category !== category) return false;
    if (vendor && expense.vendor.toLowerCase() !== vendor.toLowerCase()) {
      return false;
    }
    return true;
  });
}

export function findExpense(id) {
  return expenses.find((expense) => expense.id === id) ?? null;
}

export function addExpense(input) {
  const expense = { id: sequence++, ...input };
  expenses.push(expense);
  return expense;
}

export function removeExpense(id) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index === -1) return null;
  const [removed] = expenses.splice(index, 1);
  return removed;
}
