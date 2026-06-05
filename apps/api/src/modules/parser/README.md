# KMU Catalog Scraping & Import Pipeline Module

A robust, enterprise-grade data engineering pipeline designed to autonomously gather, sanitize, and persist official public authority records from the Cabinet of Ministers of Ukraine (**Кабінет Міністрів України — КМУ**).

This module follows a clean **Service-Oriented (MVC-style) Architecture**, where infrastructure I/O, domain parsing transformations, and database persistence are decoupled into dedicated, single-responsibility services.

---

## 📂 Module Directory Structure

The module is encapsulated inside its own directory, ensuring that all components, types, and configurations are isolated from the rest of the application:

```text
src/modules/parser/
├── config/
│   └── parser.config.ts          # Centralized path & environment configuration
├── services/
│   ├── kmu-scraper.service.ts    # File system I/O (Extract layer)
│   ├── kmu-parser.service.ts     # HTML parsing & data sanitation (Transform layer)
│   ├── kmu-agency-type.service.ts# DB persistence for Agency Types (Load sub-layer)
│   ├── kmu-agency-data.service.ts# DB persistence for Agencies (Load sub-layer)
│   └── kmu-import.service.ts     # Pipeline orchestrator & transaction manager
├── types/
│   └── kmu-types.ts              # Unified type definitions (DTOs)
├── index.ts                      # Module entry point
└── README.md                     # Documentation

```

---

## 🏛️ Service Breakdown & Responsibilities

The module is split into five core services to satisfy the **Single Responsibility Principle (SRP)**:

### 1. `KmuScraperService` (Extract)

- **Responsibility**: Manages file system I/O bound requests.
- **Operation**: It safely reads the local offline HTML snapshot from the storage directory. Includes comprehensive error handling for missing files (`ENOENT`), permission issues (`EACCES`), and guard clauses for empty snapshots.

### 2. `KmuParserService` (Transform)

- **Responsibility**: Houses pure, deterministic business domain parsing logic.
- **Operation**: Utilizes `cheerio` to traverse the HTML DOM tree. It normalizes text inputs, resolves nested accordion tables, and executes **Data Sanitation routines** (scrubbing hidden mixed Latin-Cyrillic string injection typos like `Укрaїни` or `службa` to avoid data corruption).

### 3. `KmuAgencyTypeService` (Load / Core DB)

- **Responsibility**: Manages operational mutations for the `AgencyType` relational matrix.
- **Operation**: Extracts unique category names, programmatically generates URI-friendly text slugs using `slugify`, and executes safe `$transaction`-bound `upsert` queries. It returns an active `Map<string, number>` caching `[name, id]` values for lightning-fast memory lookups.

### 4. `KmuAgencyDataService` (Load / Core DB)

- **Responsibility**: Manages operational mutations for the primary `Agency` model.
- **Operation**: Maps sanitized CSV data nodes to their respective relational database category IDs. It loops through the dataset and safely triggers index-validated `upsert` queries to prevent duplication across repeated script executions.

### 5. `KmuImportService` (The Orchestrator)

- **Responsibility**: Acts as a high-level pipeline manager.
- **Operation**: It does not contain low-level Prisma block logic. Instead, it manages the lifecycle of the global database transaction (`prisma.$transaction`). It injects sub-services, streams data across the layers, and enforces a strict **Rollback policy** — ensuring database integrity if any layer fails.

---

## 🛠️ Step-by-Step Setup & Execution Guide

### 1. Initialize the Workspace Storage

Due to strict anti-bot and DDoS protection layers deployed on government servers (**Radware/ShieldSquare Mitigation Engines**), direct programmatic HTTP requests via clients like Axios will be caught by a CAPTCHA proxy wall. To circumvent this safely, the module relies on an offline DOM snapshot pipeline.

Create a dedicated `storage` folder in your application runtime root directory and initialize an empty HTML anchor file:

```bash
mkdir -p storage && touch storage/kmu_page.html

```

_(Note: The entire `/storage/` folder is globally ignored via `.gitignore` to keep the Git repository clean)._

### 2. Capture the Fresh DOM Snapshot

1. Navigate to the official directory page using a standard desktop browser:
   👉 [https://www.kmu.gov.ua/catalog](https://www.kmu.gov.ua/catalog)
2. Complete the **hCaptcha** puzzle interface manually if prompted by the security screen.
3. Once the structural catalog list fully loads, press **`Ctrl + U`** (or right-click anywhere and select **View Page Source**).
4. Select the entire source code grid raw content via **`Ctrl + A`** and copy it (**`Ctrl + C`**).
5. Open your local `storage/kmu_page.html` file in your editor, paste the full buffer text string (**`Ctrl + V`**), and save it.

### 2. Sync database

```bash
npx prisma generate
npx prisma migrate dev
```

_Note: If duplicate records already exist in your local DB container from previous mock tests, clear your DB with TRUNCATE tables._

### 4. Run the Pipeline Script

The module provides a fast-executing script hook using the native `tsx` engine to dynamically load TypeScript structures without compiler-level intermediate overhead files:

```bash
npm run parse:kmu
```

---

## 📊 Verification and Auditing

When the script successfully closes, you will receive the following terminal verification signal:

```text
[Parser][ImportService] Import execution context finished! Successfully synced 167 agencies
```

Launch the local visualizer matrix to inspect your newly structured records:

```bash
npx prisma studio
```
