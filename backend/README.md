# Smart Recruitment Analytics — Backend

A production-quality REST API for the Smart Recruitment Analytics platform, built with
NestJS, TypeScript, TypeORM and MySQL 8. It exposes CRUD endpoints for every entity in the
recruitment pipeline (candidates, jobs, recruiters, sources, applications, interviews,
offers, joining records) plus a dedicated analytics module that reproduces the metrics
found in the original CSV exports (`department_analytics.csv`, `recruitment_funnel.csv`,
`recruitment_kpis.csv`, etc.) using live SQL aggregation against the normalized database.

## 1. Project description

The API backs a recruitment analytics dashboard. It tracks candidates as they move through
the hiring funnel — Applied → Screened → Shortlisted → Interviewed → Selected → Offered →
Joined — and exposes both operational CRUD endpoints and read-only analytics endpoints for
dashboards and reporting.

## 2. Requirements

- Node.js 18+ (Node 20 recommended)
- npm 9+
- MySQL 8 with the `smart_recruitment` database already created and populated
- The following tables must already exist and contain data: `candidates`, `jobs`,
  `recruiters`, `sources`, `applications`, `interviews`, `offers`, `joining_records`

## 3. Installation

```bash
cd backend
npm install
```

## 4. Environment configuration

Copy the example environment file and fill in real values:

```bash
cp .env.example .env
```

| Variable      | Description                          | Default             |
|---------------|---------------------------------------|----------------------|
| `PORT`        | HTTP port the API listens on          | `3000`               |
| `NODE_ENV`    | `development` \| `production` \| `test` | `development`      |
| `DB_HOST`     | MySQL host                            | `localhost`          |
| `DB_PORT`     | MySQL port                            | `3306`               |
| `DB_USERNAME` | MySQL username                        | —                    |
| `DB_PASSWORD` | MySQL password                        | —                    |
| `DB_DATABASE` | MySQL database name                   | `smart_recruitment`  |

`.env` is git-ignored; never commit real credentials. `.env.example` only documents variable
names.

## 5. Database configuration

The API connects to the **existing, already-populated** `smart_recruitment` MySQL database.
`TypeOrmModule` is configured with `synchronize: false` (see `src/database/database.module.ts`)
so the backend will never alter, create, or drop tables — it only reads and writes rows
through the entities in `src/*/entities`.

## 6. Running the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api` and will reload on file changes.

## 7. Building for production

```bash
npm run build
npm run start:prod
```

## 8. Swagger

Interactive API documentation (all modules, all endpoints) is available at:

```
http://localhost:3000/api/docs
```

## 9. API endpoint overview

All routes are prefixed with `/api`.

| Resource        | Endpoints |
|------------------|-----------|
| Health           | `GET /health` |
| Candidates       | `GET,POST /candidates`, `GET,PATCH,DELETE /candidates/:id` |
| Jobs             | `GET,POST /jobs`, `GET,PATCH,DELETE /jobs/:id` |
| Recruiters       | `GET,POST /recruiters`, `GET,PATCH,DELETE /recruiters/:id` |
| Sources          | `GET,POST /sources`, `GET,PATCH,DELETE /sources/:id` |
| Applications     | `GET,POST /applications`, `GET,PATCH,DELETE /applications/:id` |
| Interviews       | `GET,POST /interviews`, `GET,PATCH,DELETE /interviews/:id` |
| Offers           | `GET,POST /offers`, `GET,PATCH,DELETE /offers/:id` |
| Joining Records  | `GET,POST /joining-records`, `GET,PATCH,DELETE /joining-records/:id` |
| Analytics        | see section 11 below |

All list (`GET` collection) endpoints support `page`, `limit`, and resource-specific filters,
and return the shape:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 1000, "totalPages": 50 }
}
```

Single-resource responses are wrapped as `{ "data": { ... } }` by the global
`TransformInterceptor`.

## 10. Example requests

```bash
# Search candidates by name, paginated
curl "http://localhost:3000/api/candidates?search=Rahul&page=1&limit=20"

# Filter jobs by department
curl "http://localhost:3000/api/jobs?department=AI%20%26%20ML"

# Filter applications by status and recruiter
curl "http://localhost:3000/api/applications?status=Joined&recruiterId=1"

# Create a candidate
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"candidateId":"C1001","candidateName":"Rahul Sharma","experienceYears":4.5,"education":"B.Tech"}'

# Update a job
curl -X PATCH http://localhost:3000/api/jobs/J001 \
  -H "Content-Type: application/json" \
  -d '{"department":"Data & Analytics"}'

# Delete a source
curl -X DELETE http://localhost:3000/api/sources/3
```

## 11. Analytics endpoints

All analytics endpoints accept the shared optional filters below as query parameters
(unused ones are simply omitted from the `WHERE` clause):

`department`, `source`, `recruiter`, `jobId`, `education`, `status`, `startDate`, `endDate`

| Endpoint | Description |
|----------|--------------|
| `GET /analytics/dashboard` | totalApplicants, totalJoined, averageTimeToHire, averageTimeToFill, averageInterviewScore, offerAcceptanceRate, hiringSuccessRate |
| `GET /analytics/funnel` | Applied → Screened → Shortlisted → Interviewed → Selected → Offered → Joined, each with a conversion rate relative to Applied |
| `GET /analytics/by-department` | applicants, joined, hiringRate, averageInterviewScore per department |
| `GET /analytics/by-department/cost` | same as above plus totalCost and costPerHire |
| `GET /analytics/by-source` | applicants, joined, hiringRate, averageInterviewScore per source |
| `GET /analytics/by-source/cost` | same as above plus totalCost and costPerHire |
| `GET /analytics/by-education` | applicants, joined, hiringRate, averageInterviewScore per education level |
| `GET /analytics/by-experience` | applicants, joined, hiringRate per experience bucket (0-2, 3-5, 6-10, 10+ years) |
| `GET /analytics/by-match` | applicants, joined, hiringRate per match-score bucket (High ≥80, Medium 60-79, Low <60) |
| `GET /analytics/by-recruiter` | candidatesSourced, shortlisted, interviewed, offers, joined, hiringRate per recruiter |
| `GET /analytics/monthly-hiring` | hires per joining month (`YYYY-MM`); `startDate`/`endDate` here filter the joining date |
| `GET /analytics/kpis` | the same dashboard metrics under human-readable keys ("Total Applicants", "Hiring Success Rate", etc.) |

### Definitions used

- **Total Applicants** — `COUNT(DISTINCT application_id)`
- **Total Joined** — applications where `joining_date IS NOT NULL`
- **Average Interview Score** — `AVG(interviews.overall_score)`
- **Hiring Rate** — `joined / applicants * 100`
- **Offer Acceptance Rate** — `accepted offers / total offers * 100`
- **Average Time to Hire** — `AVG(DATEDIFF(joining_date, application_date))` for joined candidates
- **Average Time to Fill** — `AVG(DATEDIFF(joining_date, job_posted_date))` for successful hires
- **Cost Per Hire** — `SUM(recruitment_cost) / joined`

All ratios are NULL-safe: dividing by zero returns `0` instead of throwing or returning `NaN`.

### Implementation assumptions

- Experience buckets (`0-2`, `3-5`, `6-10`, `10+` years) and match-score buckets
  (`High ≥80`, `Medium 60-79`, `Low <60`) are not part of the database schema; they were
  chosen to mirror `experience_effectiveness.csv` and `match_effectiveness.csv` and can be
  adjusted in `src/analytics/analytics.service.ts` if the original thresholds differ.
- `department`/`source`/`recruiter` filters match by name using a case-sensitive `LIKE`
  (MySQL's default collation is case-insensitive for `utf8mb4`/`latin1` text columns).

## Testing

```bash
npm run test
```

Unit tests cover the health check, candidate/job/application CRUD services (including
duplicate-id conflicts and not-found handling), and the analytics dashboard/funnel
calculations (including divide-by-zero safety).

## Architecture notes

- Controllers are thin; all business logic and TypeORM access lives in services.
- A single global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) is
  registered in `main.ts`.
- A global `HttpExceptionFilter` maps TypeORM `QueryFailedError`s (duplicate keys, FK
  violations) to clean 400-level responses without leaking driver/SQL details.
- A global `TransformInterceptor` wraps every response as `{ data }` or
  `{ data, meta }` (paginated collections) for a consistent API shape.
- `synchronize` is permanently `false` — the backend never mutates the existing schema.
