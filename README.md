# Ledger API

A small expense tracking service used by our finance dashboard. Node + Express,
JSON in and JSON out. Data is held in memory and resets when the process
restarts.

## Running locally

```bash
npm install
npm start
```

The service listens on <http://localhost:3001> (override with `PORT`).
Opening the root URL serves a short endpoint reference.

## Endpoints

| Method   | Path                    | Notes                                                     |
| -------- | ----------------------- | --------------------------------------------------------- |
| `GET`    | `/health`               | Liveness probe                                             |
| `GET`    | `/api/expenses`         | Filters: `from`, `to` (`YYYY-MM-DD`), `category`, `vendor` |
| `GET`    | `/api/expenses/summary` | Total and per-category totals for a date range             |
| `GET`    | `/api/expenses/:id`     | Single expense                                             |
| `POST`   | `/api/expenses`         | Body: `description`, `amount`, `category`, `vendor`, `date`|
| `DELETE` | `/api/expenses/:id`     | Remove an expense                                          |

Valid categories: `meals`, `travel`, `software`, `infrastructure`, `office`,
`other`.

### Examples

```bash
curl "http://localhost:3001/api/expenses?from=2026-03-01&to=2026-03-31"

curl "http://localhost:3001/api/expenses/summary?from=2026-03-01&to=2026-03-31"

curl -X POST http://localhost:3001/api/expenses \
  -H 'Content-Type: application/json' \
  -d '{"description":"Domain renewal","amount":18.5,"category":"software","vendor":"Namecheap"}'
```
