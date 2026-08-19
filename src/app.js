import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import expensesRouter from "./routes/expenses.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api/expenses", expensesRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Request body must be valid JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
