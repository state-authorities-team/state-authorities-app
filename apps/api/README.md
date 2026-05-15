# 📄 State Authorities API

This is the core service responsible for managing state authorities entity records, handling user authentication, and providing data to the frontend application.

## 🛠 Tech Stack

* **Runtime:** Node.js (v20+)
* **Language:** TypeScript
* **Framework:** Express
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Linter/Formatter:** Biome

---

## 🛠 Tooling: Biome

We use **Biome** as our all-in-one tool for linting, formatting, and organizing imports. It is significantly faster than the traditional ESLint + Prettier stack and ensures a consistent codebase.

* **Official Documentation:** [Biomejs.dev](https://biomejs.dev/guides/getting-started/)
* **VS Code Extension:** [Biome for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

> **Important:** To ensure the best development experience, please install the VS Code extension and enable "Format on Save" in your editor settings.

---

## 🗄️ Database: Prisma

We use **Prisma** as our Next-generation Node.js and TypeScript ORM. It ensures type-safety when interacting with the database and simplifies schema management.

* **Official Documentation:** [Prisma.io Docs](https://www.prisma.io/docs)
* **VS Code Extension:** [Prisma for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

> **Important:** Please install the Prisma extension to enable syntax highlighting, automated formatting for `.prisma` files, and powerful IntelliSense for schema modeling.

---

## 🚀 Quick Start

### 1. Environment Setup

Ensure you have Node.js.

Create a `.env` file in the `/backend` directory (copy from the template):

```bash
cp .env.example .env
```
`Set PORT to 3000`

SET **DATABASE_URL**: 
- You need to have database called **state_authorities** or change it in the URL
- Replace with your **username** and **password**
- Set port(default is **5432**)

Example: `postgresql://<user>:<password>@localhost:<port>/state_authorities`
### 2. Install Dependencies

```bash
npm install
```

### 3. Launch the Application

```bash
npm run dev
```

The server will be running at: `http://localhost:3000`

Use `http://localhost:3000/api/agencies` endpoint to get a list of all agencies (we don't have any agencies at the moment).

---

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the server in development mode with hot-reload (using tsx). |
| `npm run build` | Compiles TypeScript code into production-ready JavaScript (output to `dist/`). |
| `npm run start` | Runs the compiled project from the `dist/` directory. |
| `npm run lint` | Checks the code for linting and formatting issues using Biome. |
| `npm run lint:fix` | Automatically fixes linting errors and formats the code via Biome. |
| `npm run format` | Automatically formats the code via Biome.

---

## 📐 Code Convention

We use **Biome** to enforce a unified coding style. Use `npm run lint` and `npm run format` before commit.

### 1. General Principles

* **Language:** Use English for all code (variable names, function names, comments).
* **Architecture:** Follow a service-layer pattern. Controllers handle HTTP requests, while Services contain business logic and database interactions.
* **Typing:** Using `any` is strictly prohibited. If a type is unknown, use `unknown`.

### 2. Naming Conventions

* **Classes / Types:** `PascalCase` (e.g., `UserService`).
* **Variables / Functions:** `camelCase` (e.g., `getUserById`).
* **Files:** `kebab-case` (e.g., `auth-controller.ts`).
* **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`).

### 3. Database Guidelines (Prisma)

* Always run `npx prisma migrate dev` after modifying `schema.prisma`.
* Always run `npx prisma generate` after modifying `schema.prisma`.
* Avoid raw SQL queries unless the required operation cannot be achieved via Prisma's API.

### 4. Git Flow

* Ensure `npm run lint` passes before pushing any code.

---

## 🏗 Project Structure

```text
src/
├── controllers/    # Request handling & input validation
├── services/       # Business logic & Prisma operations
├── middlewares/    # Authentication, logging, error handling
├── routes/         # API endpoint definitions
├── types/          # TypeScript interfaces and types
├── utils/          # Shared utility functions
└── index.ts        # Application entry point

```

---

> **Note for the Backend Team:** Please maintain clean logs. Do not leave `console.log` statements in the code; use the built-in logging utility instead.