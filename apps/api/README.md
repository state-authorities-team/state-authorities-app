# 📄 State Authorities API

This is the core backend microservice responsible for managing state authorities entity records, handling secure user authentication, and orchestrating the autonomous AI-driven public news aggregation engine.

---

## 🛠 Tech Stack

### Core Runtime & Framework

- **Runtime Environment:** Node.js (v24+)
- **Language Compiler:** TypeScript (Strict Mode)
- **Application Framework:** Express.js (Service-Repository Architecture)

### Data Management & AI

- **Database Engine:** PostgreSQL (Cloud Instance Hosted)
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

| Method  | Route               | Description                                               | Allowed Roles |
| ------- | ------------------- | --------------------------------------------------------- | ------------- |
| **GET** | `/api/agency-types` | Fetch lists of available categories (e.g., Ministry, ODA) | Public (`-`)  |

### 🤖 Smart News Aggregator Sync Controls

| Method | Route          | Description                                       | Allowed Roles | Errors |
| ------ | -------------- | ------------------------------------------------- | ------------- | ------ |
| POST   | `/api/refresh` | Trigger KMU catalog scraping and DB sync pipeline | 401, 403, 429 | ADMIN  |

### 🔐 Security & Credential Registry

| Method   | Route                | Request Body Requirements                                         | Token Output Location      |
| -------- | -------------------- | ----------------------------------------------------------------- | -------------------------- |
| **POST** | `/api/auth/register` | `{ "email": "...", "password": "...", "confirmPassword": "..." }` | Standard Confirmation Data |
| **POST** | `/api/auth/login`    | `{ "email": "...", "password": "..." }`                           | Secure HTTP-Only Cookie    |

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

## 🚀 Quick Start & Environment Ingestion

### 1. Environment Configurations

Instantiate a local workspace parameter profile by duplicating the distribution template:

```bash
cp .env.example .env
```

Open `.env` and fill out the infrastructure connection assignments:

```ini
PORT=3000

# Connection string pointing directly to your primary Hosted Cloud PostgreSQL database
DATABASE_URL="postgresql://<db_user>:<db_password>@<cloud_host>:5432/state_authorities?schema=public"

# Connection string optimized for connection pooling setups
DIRECT_URL="postgresql://<db_user>:<db_password>@<cloud_host>:5432/state_authorities?schema=public"

# Google Gemini API key credentials
AI_API_KEY="AIzaSy..."

# JWT cryptographic key to sign and verify tokens on server
JWT_SECRET="test..."
```

### 2. Dependency Resolution

Execute a clean project package configuration alignment:

```bash
npm install
```

### 3. Synchronize Schema Dependencies

Pull and establish strongly typed data object definitions based on the current Prisma mapping rules without applying local generation loops:

```bash
npx prisma generate
```

### 4. Deploy Production Database Schemas

Apply existing migration tracking states directly onto your active remote cloud instance:

```bash
npx prisma migrate deploy
```

### 5. Boot Up the Engine

```bash
npm run dev
```

The microservice will initialize local bindings at: `http://localhost:3000`

---

Ось оновлений блок документації, який детально описує структуру, призначення та використання таблиці налаштувань **`SystemConfig`**.

Ти можеш вставити цей розділ у файл `README.md` одразу після секції **«🏗 Modular Architecture & Data Flow»** перед таблицею з ендпоїнтами.

---

## ⚙️ Dynamic Infrastructure Settings (`SystemConfig`)

To eliminate hardcoded values and prevent redundant application server reboots on production environments, the system utilizes a unified database-driven configuration ledger called `SystemConfig`.

This key-value matrix allows system administrators to adjust critical runtime orchestration parameters (like background sync schedules or scraping volume caps) on the fly directly via the database.

### 📋 Database Schema Layout

```prisma
model SystemConfig {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}

```

### 🗃️ Active Core Parameters Ingestion Matrix

| Configuration Key Tag | Production Purpose Description                                                                            | Default Target Value              | Live Validation Constraint Rules                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `NEWS_SYNC_CRON`      | Controls the background task interval execution cadence for the main news synchronization engine threads. | `"0 */3 * * *"` _(Every 3 hours)_ | Must pass strict `cron.validate()` evaluation syntax profiles at runtime. |

### 🔄 Dynamic Lifecycle Evaluation (Hot-Reload Mechanic)

The background orchestrator manager (`NewsCronManager`) triggers an isolated, ultra-lightweight database inspection heartbeat loop every 5 minutes:

1. **Polls Ledger Matrix**: Runs a high-performance primary-key index read query: `prisma.systemConfig.findUnique({ where: { key: "NEWS_SYNC_CRON" } })`.
2. **Syntax Validation Guard**: If the expression string has mutated from the active memory value, it is vetted against the library validator. Invalid syntax aborts the reload loop safely without disrupting running tasks.
3. **Graceful Thread Teardown**: Upon successful validation, the active scheduling thread reference is detached via `.stop()`, cleared from the Node.js Event Loop to prevent memory leaks, and replaced immediately with the new schedule bounds **at runtime**.

## 📜 Available Command Scripts

| Target Alias Command         | Internal Sub-Routine Context Execution Target                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run dev`                | Boots up the local environment server instance with hot-reload listening using `tsx`.                 |
| `npm run build`              | Compiles source code structures into target native JavaScript nodes inside the `/dist` container.     |
| `npm run start`              | Fires up production workloads reading from the pre-compiled native JavaScript `/dist` folder.         |
| `npm run lint`               | Inspects code styles, complexity trends, and structural setups via Biome static code analysis.        |
| `npm run lint:fix`           | Automatically rewrites formatting errors and resolves import alignments through Biome rules.          |
| `npm run format`             | Enforces uniform layout rules on all standard codebase assets instantly.                              |
| `npm run test:news-pipeline` | Runs the test pipeline using mocks to test self-healing and parsing logic without updating real data. |
| `test:news-cooldown`         | Runs a mock-based test suite for testing cooldown guard behavior                                      |

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

---
