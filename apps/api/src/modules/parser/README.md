# KMU Catalog Scraping & Import Pipeline Module

A robust, enterprise-grade data engineering pipeline designed to autonomously gather, sanitize, and persist official public authority records from the Cabinet of Ministers of Ukraine (**Кабінет Міністрів України — КМУ**).

This module follows a clean **Service-Oriented (MVC-style) Architecture**, where infrastructure I/O, domain parsing transformations, and database persistence are decoupled into dedicated, single-responsibility services.

---

## 📂 Module Directory Structure

The module is encapsulated inside its own directory, ensuring that all components, types, and configurations are isolated from the rest of the application:

```text
src/modules/parser/
├── config/
│   └── puppeteer-config.ts        # Puppetter configuration
├── services/
│   ├── kmu-agency-data-service.ts # DB persistence for Agencies (Load sub-layer)
│   ├── kmu-agency-type-service.ts # DB persistence for Agency Types (Load sub-layer)
│   ├── kmu-import-service.ts      # Pipeline orchestrator
│   ├── kmu-parser.service.ts      # HTML parsing & data sanitation (Transform layer)
│   └── kmu-scraper.service.ts     # Web scrapper(Extract layer)
├── types/
│   └── kmu-types.ts               # Unified type definitions (DTOs)
├── index.ts                       # Module entry point
└── README.md                      # Documentation
```

## 🏛️ Service Breakdown & Responsibilities

The module is strictly split into core services to fully satisfy the **Single Responsibility Principle (SRP)** and optimize runtime efficiency:

### 1. `KmuScraperService` (Extract)

- **Responsibility**: Manages the browser automation lifecycle and network I/O.
- **Operation**: Launches a headless (invisible) Chromium instance via `puppeteer` to bypass client-side rendering bottlenecks. It navigates to the live portal, waits dynamically for the JavaScript-driven elements to mount, extracts the full raw HTML string using `page.content()`, and immediately terminates the browser process to prevent server memory leaks.

### 2. `KmuParserService` (Transform)

- **Responsibility**: Houses pure, deterministic business domain parsing logic.
- **Operation**: Accepts the raw HTML string and utilizes `cheerio` to rapidly traverse the static DOM tree on the Node.js side. It normalizes text inputs, parses nested accordion sub-panels (`.slide-panel li a`) to extract parent and subordinated state agencies, and formats unified data objects ready for database ingestion.

### 3. `KmuAgencyTypeService` (Load / Core DB)

- **Responsibility**: Manages operational mutations for the `AgencyType` relational matrix.
- **Operation**: Extracts unique category names (e.g., Ministries, Services, Agencies), programmatically generates URI-friendly text slugs using `slugify`, and executes stable database `upsert` queries. It returns an active `Map<string, number>` caching `[name, id]` values for lightning-fast lookups.

### 4. `KmuAgencyDataService` (Load / Core DB)

- **Responsibility**: Manages operational mutations for the primary `Agency` model.
- **Operation**: Maps parsed data nodes (including scraped website URLs) to their respective relational category IDs. It loops through the dataset and executes non-transactional, index-validated individual `upsert` queries. This ensures long-running sync scripts never exceed хмари cloud timeouts (like Render's 5-second locks).

### 5. `KmuImportService` (The Orchestrator)

- **Responsibility**: Acts as a high-level pipeline manager (Facade Pattern).
- **Operation**: Coordinates data streaming across all sub-services. It triggers the scraper, pipes the raw HTML into the Cheerio parser, builds the relational category map, and pushes final records to the database client wrapper without locking tables.

---

## 🛠️ Step-by-Step Setup & Execution Guide

### 1. Configuration Check

The parser runs dynamically using headless browser parameters. Ensure your environment configurations inside `src/config/puppeteer-config.ts` contain required arguments (`--no-sandbox`, etc.) to allow stable operation within restricted Linux containers (e.g., Render.com or Docker environments).

### 2. Sync Database Schema

Before running the automated crawler, ensure your local or cloud relational state matches your current Prisma schema setup:

```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Run the Automated Live Pipeline

The pipeline completely eliminates manual file creation or page source copying. It runs natively using a high-performance TypeScript execution engine:

```bash
npm run parse:kmu
```

---

## 📊 Verification and Auditing

The system logs structural metrics in real-time. Upon successful completion, your terminal output stream will confirm execution steps:

```text
2026-06-08T12:00:00.000Z : [Parser] Initializing automated live database update...
2026-06-08T12:00:00.002Z : [Parser][ImportService] Initializing automated streaming pipeline
2026-06-08T12:00:00.003Z : [Parser][ScrapperService] Launching headless browser...
2026-06-08T12:00:02.150Z : [Parser][ScrapperService] Navigating to live URL...
2026-06-08T12:00:05.420Z : [Parser][ScrapperService] Extracting raw HTML source code...
2026-06-08T12:00:06.100Z : [Parser][ScrapperService] Browser closed. Parsing DOM via Cheerio...
2026-06-08T12:00:06.350Z : [Parser][TypeService] All AgencyTypes successfully synchronized
2026-06-08T12:00:11.890Z : [Parser][ImportService] Successfully synced 132 elements.

```

Launch the Prisma internal database visualizer engine to inspect your live synchronized production-ready rows:

```bash
npx prisma studio
```
