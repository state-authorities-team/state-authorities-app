# 📄 State Authorities API

This is the core backend microservice responsible for managing state authorities entity records, handling secure user authentication, and orchestrating the autonomous AI-driven public news aggregation engine.

---

## 🛠 Tech Stack

### Core Runtime & Framework

- **Runtime Environment:** Node.js (v24+)
- **Language Compiler:** TypeScript (Strict Mode)
- **Application Framework:** Express.js (Service-Repository Architecture)

### Data Management & AI

- **Database Engine:** PostgreSQL (Cloud Instance Hosted on Neon/Supabase; no local container in compose)
- **Object-Relational Mapping (ORM):** Prisma Client
- **Artificial Intelligence Layer:** Google Gemini API (`gemini-3.1-flash-lite` via `@google/genai`)

### Code Quality & Tooling

- **All-in-One Linter & Formatter:** Biome (Replacing ESLint + Prettier)
- **Process Automation:** `node-cron` (Dynamic Runtime Hot-Reloading Scheduler)
- **Headless I/O Scraping:** Puppeteer (`puppeteer-core` with Chromium runtime anchors)

---

## 🏗 Modular Architecture & Data Flow

The codebase strictly adheres to **Separation of Concerns (SoC)** and **Layered Architecture** principles. Direct SQL mapping is completely isolated into dedicated repositories, separating database infrastructure from core operational business workflows.

---

## 📡 Endpoints

### 🏢 State Agencies Management

| Method     | Route                      | Description                                                     | Allowed Roles | Errors                     |
| ---------- | -------------------------- | --------------------------------------------------------------- | ------------- | -------------------------- |
| **GET**    | `/api/agencies`            | Retrieve paginated and filtered list of agencies                | Public (`-`)  | `500`                      |
| **GET**    | `/api/agencies/export`     | Export all state agencies as a CSV file                         | Public (`-`)  | `500`                      |
| **GET**    | `/api/agencies/:id`        | Fetch specific public agency record by ID                       | Public (`-`)  | `400`, `404`               |
| **POST**   | `/api/agencies`            | Insert a new state agency profile manually                      | `ADMIN`       | `400`, `401`, `403`        |
| **PUT**    | `/api/agencies/:id`        | Update structural metadata of an existing agency                | `ADMIN`       | `400`, `401`, `403`, `404` |
| **DELETE** | `/api/agencies/:id`        | Hard delete an agency record from the infrastructure            | `ADMIN`       | `401`, `403`, `404`        |
| **POST**   | `/api/agencies/import-csv` | Stream and bulk-ingest agency records via standard CSV template | `ADMIN`       | `400`, `401`, `403`        |

#### 🔍 Agencies Filter Queries

`GET /api/agencies?page=1&limit=20&type=ministry&search=цифрової`

- `page`: Track sequence page pointer (Default: `1`).
- `limit`: Output constraint window per query page (Default: `20`).
- `type`: Filter collection exclusively by target agency type slug.
- `search`: Fuzzy search indexing across titles, regions, and descriptions.

### 🗂️ Agency Structural Classifications

| Method   | Route                          | Description                                                    | Allowed Roles | Errors       |
| -------- | ------------------------------ | -------------------------------------------------------------- | ------------- | ------------ |
| **GET**  | `/api/agency-types`            | Fetch lists of available categories (e.g., Ministry, ODA)      | Public (`-`)  | `500`        |
| **GET**  | `/api/agency-types/export`     | Export all agency structural classifications as a CSV file     | Public (`-`)  | `500`        |
| **POST** | `/api/agency-types/import-csv` | Stream and bulk-ingest agency classifications via CSV template | Public (`-`)  | `400`, `500` |

### 🤖 Smart News Aggregator Sync Controls

| Method | Route          | Description                                       | Errors        | Allowed Roles |
| ------ | -------------- | ------------------------------------------------- | ------------- | ------------- |
| POST   | `/api/refresh` | Trigger KMU catalog scraping and DB sync pipeline | 401, 403, 429 | ADMIN         |

### 🔐 Security & Credential Registry

| Method   | Route                | Request Body Requirements                                         | Token Output Location      |
| -------- | -------------------- | ----------------------------------------------------------------- | -------------------------- |
| **POST** | `/api/auth/register` | `{ "email": "...", "password": "...", "confirmPassword": "..." }` | Standard Confirmation Data |
| **POST** | `/api/auth/login`    | `{ "email": "...", "password": "..." }`                           | Secure HTTP-Only Cookie    |
| **POST** | `/api/auth/logout`   |                                                                   | Set token max-age to 0     |

### 🏢 News per Agency

| Method  | Route                    | Description                                               | Allowed Roles | Errors     |
| ------- | ------------------------ | --------------------------------------------------------- | ------------- | ---------- |
| **GET** | `/api/agencies/:id/news` | Retrieve paginated and filtered list of news by agency id | Public (`-`)  | `404, 500` |

### 🩺 Monitoring & API Documentation

| Method  | Route         | Description                                                      | Allowed Roles | Errors |
| ------- | ------------- | ---------------------------------------------------------------- | ------------- | ------ |
| **GET** | `/api/health` | Check server status, process uptime, and database connectivity   | Public (`-`)  | `503`  |
| **GET** | `/api-docs`   | Swagger UI interactive API documentation (OpenAPI Specification) | Public (`-`)  | `404`  |

---

## 📦 Data Interchange Payload Formats

### 🟢 Standard Collection Output (200 OK)

```json
{
  "success": true,
  "count": 1,
  "total": 120,
  "totalPages": 6,
  "currentPage": 1,
  "data": [
    {
      "id": 144,
      "name": "Міністерство цифрової трансформації України",
      "shortName": "Мінцифра",
      "website": "https://thedigital.gov.ua/"
    }
  ]
}
```

### 🟢 CSV Data Ingestion Outcome

```json
{
  "success": true,
  "message": "CSV file was processed successfully",
  "data": {
    "totalRows": 25,
    "imported": 21,
    "skipped": 4
  }
}
```

### 🔴 Standard Error Envelope (4xx / 5xx)

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## 🚀 Quick Start & Environment Configuration

### 1. Environment Configurations

Instantiate a local workspace parameter profile by duplicating the distribution template:

```bash
cp .env.example .env
```

Open `.env` and fill out the configuration parameters. Refer to the table below for detailed descriptions:

| Key              | Description                                                                                                                                                                                                                                                                                                                               | Example / Default                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `PORT`           | Local server port assignment.                                                                                                                                                                                                                                                                                                             | `3000`                                                                             |
| `DATABASE_URL`   | Cloud database (Neon/Supabase) connection string utilizing transaction/connection pooling. Recommended for general application usage.                                                                                                                                                                                                     | `postgresql://<user>:<password>@<pooler_host>:5432/state_authorities?pooling=true` |
| `DIRECT_URL`     | Direct connection string to the PostgreSQL cloud database instance bypassing the connection pooler. **Must be provided** to run database migrations (as connection poolers do not support DDL-based queries). **Important:** This connection string must NOT contain any pooling parameters (such as `pooling=true` or `pgbouncer=true`). | `postgresql://<user>:<password>@<direct_host>:5432/state_authorities`              |
| `FRONTEND_URL`   | Allowed origin URL for CORS configuration.                                                                                                                                                                                                                                                                                                | `http://localhost:5173` (for local)                                                |
| `JWT_SECRET`     | Secret key used to sign and verify JSON Web Tokens (JWT).                                                                                                                                                                                                                                                                                 | `some_secure_random_string`                                                        |
| `JWT_EXPIRES_IN` | Token validity duration.                                                                                                                                                                                                                                                                                                                  | `7d`                                                                               |
| `AI_API_KEY`     | Google Gemini API key credential. Used for translating crawled news, identifying news categories/sentiment, and handling dynamic selector self-healing.                                                                                                                                                                                   | `AIzaSy...`                                                                        |
| `NODE_ENV`       | Application environment identifier.                                                                                                                                                                                                                                                                                                       | `dev`                                                                              |
| `LOG_LEVEL`      | Application logs level                                                                                                                                                                                                                                                                                                                    | `debug`                                                                            |

### 2. Step-by-Step Launch Guide

Follow these sequential steps to boot the backend environment:

#### 1. Install Dependencies

Resolve packages and dependencies defined in the package manager layout:

```bash
npm install
```

#### 2. Generate Prisma Client

Generate the strongly typed Prisma client matching the current schema layouts:

```bash
npx prisma generate
```

#### 3. Deploy Database Migrations

Apply existing migrations to the active database (requires `DIRECT_URL` defined in `.env` to bypass poolers):

```bash
npx prisma migrate deploy
```

#### 4. Start Development Server

Start the local server instance with active hot-reloads via `tsx`:

```bash
npm run dev
```

The microservice API will be live at: `http://localhost:3000`

---

## ⚙️ Dynamic Infrastructure Settings (`SystemConfig`)

To eliminate hardcoded values and prevent redundant application server reboots on production environments, the system utilizes a unified database-driven configuration ledger called `SystemConfig`.

This key-value matrix allows system administrators to adjust critical runtime orchestration parameters (like background sync schedules or scraping volume caps) on the fly directly via the database.

### 📋 Database Schema Layout

```prisma
model SystemConfig {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

### 🗃️ Active Core Parameters Ingestion Matrix

| Configuration Key      | Description                                                                                                                                                                    | Default Value                   | Validation & Constraint Rules                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------ |
| `NEWS_SYNC_CRON`       | Controls the background task interval execution cadence for the main news synchronization engine threads. Watchdog inspects this every 5 minutes and hot-reloads the cron job. | `"0 */3 * * *"` (Every 3 hours) | Must be a valid cron expression syntax (validated via `cron.validate()` at runtime). |
| `NEWS_MAX_PARSE_COUNT` | Restricts the maximum number of news articles extracted and imported per catalog synchronization run for each agency.                                                          | `10`                            | Must be a positive integer. If not set or invalid, defaults to `10`.                 |

### 🔄 Dynamic Lifecycle Evaluation (Hot-Reload Mechanic)

The background orchestrator manager (`NewsCronManager`) triggers an isolated, ultra-lightweight database inspection heartbeat loop every 5 minutes:

1. **Polls Ledger Matrix**: Runs a high-performance primary-key index read query: `prisma.systemConfig.findUnique({ where: { key: "NEWS_SYNC_CRON" } })`.
2. **Syntax Validation Guard**: If the expression string has mutated from the active memory value, it is vetted against the library validator. Invalid syntax aborts the reload loop safely without disrupting running tasks.
3. **Graceful Thread Teardown**: Upon successful validation, the active scheduling thread reference is detached via `.stop()`, cleared from the Node.js Event Loop to prevent memory leaks, and replaced immediately with the new schedule bounds **at runtime**.

---

## 📜 Available Command Scripts

These are the scripts defined in `package.json` that are used to develop, build, test, and audit the application:

| Script Command               | Description                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run dev`                | Boots up the local environment server instance with hot-reload listening using `tsx`.                 |
| `npm run build`              | Compiles TypeScript source structures into native JavaScript inside the `/dist` output folder.        |
| `npm run start`              | Fires up production workloads reading from the pre-compiled `/dist` folder.                           |
| `npm run lint`               | Inspects code styles, complexity trends, and structural setups via Biome static code analysis.        |
| `npm run lint:fix`           | Automatically rewrites formatting errors and resolves import alignments through Biome rules.          |
| `npm run format`             | Enforces uniform layout and styling rules on all standard codebase assets instantly using Biome.      |
| `npm run parse:kmu`          | Runs KMU web portal scraping/parsing directly for manual debugging of catalog structures.             |
| `npm run typecheck`          | Validates TypeScript types and safety constraints without compilation output.                         |
| `npm run test:news-pipeline` | Runs the test pipeline using mocks to test self-healing and parsing logic without updating real data. |
| `npm run test:news-cooldown` | Runs a mock-based test suite for testing cooldown guard behavior.                                     |
| `npm run test:rate-limit`    | Runs a mock-based test suite for testing scraping rate limits and cooldown guards.                    |

---

## 📐 Strict Coding Conventions & Design Bounds

### 1. General Strict Bounds

- **Strict Typing Isolation:** The use of `any` is strictly prohibited. If an arbitrary incoming object layout cannot be fully determined, it must be bound to `unknown` and passed through functional runtime type guard filters.
- **Complexity Thresholds:** To prevent deep conditional structures, individual method blocks must keep clean logic layouts. They should not exceed a **cyclomatic complexity ceiling score of 15**, as enforced by the local Biome engine rules.
- **Asynchronous Flow Control:** All browser lifecycle interactions (`puppeteer`) and internal I/O operations must be fully guarded through deterministic `await` invocations. No promises should float unhandled outside the engine execution stacks.

### 2. Standard Naming Alignments

- **Class Contexts / DTO Interfaces:** PascalCase pattern format definitions (`NewsImportService`, `ScrapeSelectors`).
- **Variables / Service Routines:** camelCase pattern format definitions (`syncAgencyNews`, `targetUrl`).
- **File Asset Containers:** kebab-case standard structural format separators (`news-repository.ts`, `db-config.ts`).
- **Immutables / System Configuration Key Tags:** UPPER_SNAKE_CASE pattern layouts (`NEWS_SYNC_CRON`, `MAX_RETRY_ATTEMPTS`).
