import { Router } from "express";
import {
  addExpense,
  filterExpenses,
  findExpense,
  removeExpense,
} from "../store.js";

const router = Router();

const CATEGORIES = [
  "meals",
  "travel",
  "software",
  "infrastructure",
  "office",
  "other",
];

// GET /api/expenses?from=2026-03-01&to=2026-03-31&category=travel&vendor=Bolt
router.get("/", (req, res) => {
  const { from, to, category, vendor } = req.query;

  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `Unknown category "${category}". Expected one of: ${CATEGORIES.join(", ")}`,
    });
  }

  const results = filterExpenses({ from, to, category, vendor });

  res.json({
    count: results.length,
    expenses: [...results].sort((a, b) => a.date.localeCompare(b.date)),
  });
});

// GET /api/expenses/summary?from=&to=
router.get("/summary", (req, res) => {
  const { from, to } = req.query;
  const results = filterExpenses({ from, to });

  const byCategory = {};
  for (const expense of results) {
    byCategory[expense.category] =
      (byCategory[expense.category] ?? 0) + expense.amount;
  }

  const total = results.reduce((sum, expense) => sum + expense.amount, 0);

  res.json({
    count: results.length,
    total: Number(total.toFixed(2)),
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([key, value]) => [
        key,
        Number(value.toFixed(2)),
      ])
    ),
  });
});

router.get("/:id", (req, res) => {
  const expense = findExpense(Number(req.params.id));

  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json({ expense });
});

router.post("/", (req, res) => {
  const { description, vendor, category, amount, date } = req.body ?? {};

  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ error: "description is required" });
  }

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: "amount is required" });
  }

  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `Unknown category "${category}". Expected one of: ${CATEGORIES.join(", ")}`,
    });
  }

  const expense = addExpense({
    description: description.trim(),
    vendor: typeof vendor === "string" && vendor.trim() ? vendor.trim() : "unknown",
    category: category ?? "other",
    amount,
    date: date ?? new Date().toISOString(),
  });

  res.status(201).json({ expense });
});

router.delete("/:id", (req, res) => {
  const removed = removeExpense(Number(req.params.id));

  if (!removed) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json({ deleted: removed });
});

export default router;
