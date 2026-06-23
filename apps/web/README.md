# Front-End Part

This folder contains the front-end application for the **State Authorities Catalog** project.

The front-end application is located in:

```text
/apps/web
```

The implementation follows the project Figma design and contains the main user-facing pages, catalog UI, institution details page, admin login flow, reusable SVG sprite icons, and API integration with the backend.

Figma [design](https://www.figma.com/design/G8QMwYywDHrtvZo1jtQms5/%D0%9A%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3-%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%B2%D0%BD%D0%B8%D1%85-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D1%96%D0%B2-%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8?node-id=216-196&p=f&t=swDNlTcK3ubrNTwB-0)

---

## Current Status

This front-end currently includes:

- React + TypeScript application structure
- Page routing with `react-router-dom`
- Home page
- Catalog page
- Institution details page
- Login page
- Protected Admin page
- Shared Header, Footer, and PageContainer layout components
- SVG sprite icon system
- HTML icon preview file
- Catalog search, filters, sorting, and pagination
- Loading, error, and empty states
- API client layer for backend communication
- Backend integration for agencies, agency types, and agency news
- Backend-connected admin authentication flow
- Admin agency management UI
- Admin create, read, update, and delete operations
- Admin CSV import and export actions
- Custom admin modal windows for add/edit/view, delete confirmation, and import/export results

This is an active front-end implementation connected to the backend API.

Important current limitations:

- Admin authentication depends on the backend auth cookie and correct Render/CORS configuration.
- Real admin credentials must be managed on the backend side and must not be committed to the frontend repository.
- Agency news exists only for agencies that have backend news records.
- Related agencies were removed from the institution page because the backend related-agencies endpoint is not currently mapped.
- The frontend Render deployment must use `VITE_API_URL` to connect to the deployed backend.
- The backend Render deployment must use `FRONTEND_URL` to allow the deployed frontend origin.
- CSV import depends on valid CSV column names and agency type names that exist in the backend database.

---

## Branch Information

The main development branch is:

```text
develop
```

The current feature work for the API client, admin auth, catalog updates, institution page updates, admin page updates, and frontend deployment fixes is done on a feature branch created from `develop`.

Example feature branch naming:

```text
feature/SA-29-api-client-web
```

Pull requests should target:

```text
develop
```

Before creating a pull request, make sure the branch is based on the latest `develop`.

---

## Project Structure

```text
apps/web/
├── public/
│   ├── icons.svg
│   └── ReadmeImgs/
│       └── svg-sprite-preview.html
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── agencies.ts
│   │   ├── agencyTypes.ts
│   │   └── auth.ts
│   ├── auth/
│   │   ├── AdminAuthContext.tsx
│   │   ├── adminAuthStore.ts
│   │   └── useAdminAuth.ts
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAgencyForm.tsx
│   │   │   ├── AdminAgencyForm.module.css
│   │   │   ├── AdminCard.tsx
│   │   │   ├── AdminCard.module.css
│   │   │   ├── AdminConfirmDialog.tsx
│   │   │   ├── AdminConfirmDialog.module.css
│   │   │   ├── AdminHero.tsx
│   │   │   ├── AdminHero.module.css
│   │   │   ├── AdminResultDialog.tsx
│   │   │   ├── AdminResultDialog.module.css
│   │   │   ├── AdminToolbar.tsx
│   │   │   └── AdminToolbar.module.css
│   │   ├── catalog/
│   │   │   ├── CatalogFilters.tsx
│   │   │   ├── CatalogToolbar.tsx
│   │   │   ├── InstitutionCard.tsx
│   │   │   ├── InstitutionList.tsx
│   │   │   └── Pagination.tsx
│   │   ├── home/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── StatsSection.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.module.css
│   │   │   └── PageContainer.tsx
│   │   └── ui/
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── Icon.tsx
│   │       └── LoadingState.tsx
│   ├── hooks/
│   │   └── useDebounce.ts
│   ├── pages/
│   │   ├── AdminPage.tsx
│   │   ├── CatalogPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── InstitutionPage.tsx
│   │   └── LoginPage.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedAdminRoute.tsx
│   ├── styles/
│   │   ├── AdminPage.module.css
│   │   ├── CatalogFilters.module.css
│   │   ├── CatalogPage.module.css
│   │   ├── EmptyState.module.css
│   │   ├── ErrorState.module.css
│   │   ├── InstitutionList.module.css
│   │   ├── InstitutionPage.module.css
│   │   ├── LoadingState.module.css
│   │   ├── LoginPage.module.css
│   │   ├── Pagination.module.css
│   │   └── global.css
│   ├── types/
│   │   ├── agency.ts
│   │   ├── api.ts
│   │   └── institution.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

---

## Pages

The application currently has these main routes:

```text
/                  Home page
/catalog           Catalog page
/institutions/:id  Institution details page
/login             Admin login page
/admin             Protected admin page
```

---

### 1. Home Page

File:

```text
src/pages/HomePage.tsx
```

Purpose:

The Home page is the landing page for the platform.

Main sections:

- Hero section
- Search block
- Statistics cards
- Main institution categories
- About platform section

Home sections are located in:

```text
src/components/home
```

Current components:

```text
HeroSection.tsx
StatsSection.tsx
CategoriesSection.tsx
AboutSection.tsx
```

---

### 2. Catalog Page

File:

```text
src/pages/CatalogPage.tsx
```

Purpose:

The Catalog page displays a list of state authorities.

Main functionality:

- Loads agencies from the backend API
- Loads agency types from the backend API
- Search by institution name
- Filter by agency type
- Sort agencies
- Paginate agency results
- Display loading, error, and empty states
- Navigate to an institution details page when an institution card is clicked

Related components:

```text
src/components/catalog/CatalogFilters.tsx
src/components/catalog/CatalogToolbar.tsx
src/components/catalog/InstitutionCard.tsx
src/components/catalog/InstitutionList.tsx
src/components/catalog/Pagination.tsx
```

---

### 3. Institution Details Page

File:

```text
src/pages/InstitutionPage.tsx
```

Purpose:

The Institution page displays detailed information about one selected institution.

The institution ID is taken from the route:

```text
/institutions/:id
```

Example:

```text
/institutions/244
```

Main sections:

- Back link
- Institution title and category tag
- Main information block
- Leadership block
- Latest news section
- Description section

Backend data used:

```text
GET /api/agencies/:id
GET /api/agencies/:id/news
```

News notes:

- News exists only for agencies that have backend news records.
- The news endpoint supports pagination.
- The backend returns news sorted by latest date by default.
- The UI shows 3 latest news items on the institution page.
- The news date is displayed in the format `HH:mm DD.MM.YYYY`.

The related agencies section was removed because the backend related-agencies endpoint is not currently available.

---

### 4. Login Page

File:

```text
src/pages/LoginPage.tsx
```

Route:

```text
/login
```

Purpose:

The Login page allows an admin user to authenticate through the backend and access the protected Admin page.

The login form sends credentials to the backend authentication endpoint:

```text
POST /api/auth/login
```

Logout is handled through:

```text
POST /api/auth/logout
```

Important:

- Admin credentials must not be stored in the frontend README.
- Admin credentials must not be committed to the repository.
- Admin credentials are managed on the backend side.
- The frontend only sends the login request and relies on the backend authentication cookie.

---

### 5. Admin Page

File:

```text
src/pages/AdminPage.tsx
```

Route:

```text
/admin
```

Purpose:

The Admin page is protected by the admin auth guard and is used for managing agency records.

The protected route is handled by:

```text
src/routes/ProtectedAdminRoute.tsx
```

Admin-related files:

```text
src/pages/AdminPage.tsx
src/pages/LoginPage.tsx
src/routes/ProtectedAdminRoute.tsx
src/auth/AdminAuthContext.tsx
src/auth/adminAuthStore.ts
src/auth/useAdminAuth.ts
src/api/auth.ts
src/api/agencies.ts
src/components/admin/AdminToolbar.tsx
src/components/admin/AdminCard.tsx
src/components/admin/AdminHero.tsx
src/components/admin/AdminAgencyForm.tsx
src/components/admin/AdminConfirmDialog.tsx
src/components/admin/AdminResultDialog.tsx
```

Admin-only backend operations include:

```text
POST   /api/agencies
PUT    /api/agencies/:id
DELETE /api/agencies/:id
POST   /api/agencies/import-csv
GET    /api/agencies/export
```

These backend routes require an authenticated `ADMIN` user.

Current admin functionality:

- Admin page loads backend agency data.
- Admin login/logout uses the backend authentication endpoints.
- Admin authentication is handled through an HTTP-only backend cookie.
- Admin can add new agencies.
- Admin can view agency details in a read-only modal.
- Admin can edit existing agencies.
- Admin can delete agencies through a custom confirmation modal.
- Admin can import agencies from a CSV file.
- Admin can export agencies to a CSV file.
- Import/export errors are displayed through custom modal windows.
- Import results show total rows, imported rows, and skipped rows.
- Modal windows lock background page scrolling while open.

Correct Render/CORS configuration is required for deployed admin authentication to work.

---

## Routing

Routing is handled with `react-router-dom`.

Routes are defined in:

```text
src/routes/AppRoutes.tsx
```

Current route structure:

```tsx
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { InstitutionPage } from "../pages/InstitutionPage";
import { LoginPage } from "../pages/LoginPage";
import { AdminPage } from "../pages/AdminPage";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/institutions/:id" element={<InstitutionPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
```

Routes are rendered inside:

```text
src/App.tsx
```

---

## API Client

The frontend API client is located in:

```text
src/api/client.ts
```

The client uses Axios.

Current API client pattern:

```ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

The `withCredentials: true` option is needed because backend authentication uses an HTTP-only cookie. This allows the browser to include backend auth cookies in admin login/logout and admin-protected requests.

---

## Environment Keys

The frontend/backend setup uses two important environment values:

```text
VITE_API_URL
FRONTEND_URL
```

They are used in different places.

```text
VITE_API_URL = used by the frontend
FRONTEND_URL = used by the backend
```

---

### `VITE_API_URL`

The frontend supports a Vite environment key:

```text
VITE_API_URL
```

This key tells the deployed frontend where the backend API is located.

### Why this key is needed

During local development, the app can use the Vite dev-server proxy with:

```text
/api
```

However, the Vite proxy only works locally with:

```bash
npm run dev
```

After deployment, the built frontend cannot use the Vite dev proxy. Without `VITE_API_URL`, the deployed frontend may incorrectly call its own frontend Render domain:

```text
https://state-authorities-app-1.onrender.com/api/...
```

The real backend API is deployed separately, so the production frontend must call the backend Render URL directly.

### Render frontend environment variable

In the frontend Render service, add:

```text
VITE_API_URL=https://state-authorities-app.onrender.com/api
```

After adding or changing this variable, redeploy the frontend service because Vite environment variables are injected at build time.

### Local development

For local development, this variable is optional.

If `VITE_API_URL` is not set, the app falls back to:

```text
/api
```

This allows local development to keep using the Vite proxy from `vite.config.ts`.

Optional local `.env` example:

```text
VITE_API_URL=https://state-authorities-app.onrender.com/api
```

Do not commit real `.env` files if they contain sensitive values.

---

### `FRONTEND_URL`

`FRONTEND_URL` is used by the backend.

It tells the backend which frontend origin is allowed to access it through CORS.

This is especially important for admin login and admin-protected requests because backend authentication uses an HTTP-only cookie. The browser will only send and receive that cookie correctly if the backend allows the frontend origin and credentials.

Backend Render environment variable:

```text
FRONTEND_URL=https://state-authorities-app-1.onrender.com
```

For local backend development, the backend `.env` should allow:

```text
FRONTEND_URL=http://localhost:5173
```

In short:

```text
VITE_API_URL  = where the frontend sends API requests
FRONTEND_URL  = which frontend origin the backend allows
```

Example setup:

```text
Frontend local URL: http://localhost:5173
Backend local URL:  http://localhost:3000/api

Frontend Render URL: https://state-authorities-app-1.onrender.com
Backend Render API:  https://state-authorities-app.onrender.com/api
```

---

## Backend API Usage

API-related functions are located in:

```text
src/api
```

Current API files:

```text
client.ts
agencies.ts
agencyTypes.ts
auth.ts
```

Current backend endpoints used by the frontend:

```text
GET    /api/agencies
GET    /api/agencies/:id
GET    /api/agencies/:id/news
GET    /api/agency-types
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/agencies
PUT    /api/agencies/:id
DELETE /api/agencies/:id
POST   /api/agencies/import-csv
GET    /api/agencies/export
```

Public examples:

```text
GET /api/agencies?page=1&limit=6
GET /api/agencies?type=ministerstvo
GET /api/agencies?search=цифрової
GET /api/agencies/244
GET /api/agencies/244/news?page=1&limit=3
GET /api/agency-types
```

Admin examples:

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/agencies
PUT    /api/agencies/:id
DELETE /api/agencies/:id
POST   /api/agencies/import-csv
GET    /api/agencies/export
```

---

## Components

Components are stored in:

```text
src/components
```

The main component groups are:

```text
components/
├── catalog/
├── home/
├── layout/
└── ui/
```

---

### `components/layout`

Contains shared layout components used across the whole application.

Current components:

```text
Header.tsx
Header.module.css
Footer.tsx
Footer.module.css
PageContainer.tsx
```

#### Header

File:

```text
src/components/layout/Header.tsx
```

The header contains:

- Logo
- Link to Home page
- Link to Catalog page
- Admin link
- Login/logout button
- SVG icons from the sprite file
- Active and hover navigation states

#### Footer

File:

```text
src/components/layout/Footer.tsx
```

The footer contains:

- Logo
- General platform description
- Project information links

#### PageContainer

File:

```text
src/components/layout/PageContainer.tsx
```

This component keeps page content aligned to the same maximum width.

---

### `components/ui`

Contains small reusable UI components.

Current components:

```text
Icon.tsx
LoadingState.tsx
ErrorState.tsx
EmptyState.tsx
```

The `Icon` component is used to render icons from the SVG sprite.

---

### `components/home`

Contains Home page section components.

Current components:

```text
HeroSection.tsx
StatsSection.tsx
CategoriesSection.tsx
AboutSection.tsx
```

---

### `components/catalog`

Contains Catalog page components.

Current components:

```text
CatalogFilters.tsx
CatalogToolbar.tsx
InstitutionCard.tsx
InstitutionList.tsx
Pagination.tsx
```

Responsibility:

- `CatalogFilters.tsx` — filter sidebar, search input, category select, sorting select
- `CatalogToolbar.tsx` — result count
- `InstitutionCard.tsx` — one clickable institution card
- `InstitutionList.tsx` — list of institution cards
- `Pagination.tsx` — pagination controls

### `components/admin`

Contains Admin page components used for agency management.

Current components:

```text
AdminHero.tsx
AdminToolbar.tsx
AdminCard.tsx
AdminAgencyForm.tsx
AdminConfirmDialog.tsx
AdminResultDialog.tsx
```

Responsibility:

- `AdminHero.tsx` — admin page title and total agency counter
- `AdminToolbar.tsx` — admin search, filter, sort, add, import, and export controls
- `AdminCard.tsx` — one admin agency card with view, edit, and delete actions
- `AdminAgencyForm.tsx` — add/edit form and read-only agency view modal
- `AdminConfirmDialog.tsx` — custom confirmation modal for delete actions
- `AdminResultDialog.tsx` — custom result modal for CSV import/export errors and import summaries

---

## Styling Rules

Global styles are stored in:

```text
src/styles/global.css
```

`global.css` should contain only styles that are shared across the whole application.

Examples of what belongs in `global.css`:

- CSS reset
- CSS variables
- `body` styles
- Base typography
- Base link styles
- Base button/input font inheritance
- Shared utility classes
- `.page-container`
- `.section`
- `.card`

Component-specific styles should not be placed in `global.css`.

For example:

```text
Header styles        → Header.module.css
Footer styles        → Footer.module.css
Catalog page styles  → CatalogPage.module.css
Institution styles   → InstitutionPage.module.css
Home styles          → Home component modules
```

---

## CSS Variables

Shared design tokens are stored in:

```text
src/styles/global.css
```

Current important variables:

```css
:root {
  --fon-2: #eeeeee;
  --fon-1: #ffffff;
  --kdou-primary: #031126;
  --kdou-background: #ffffff;
  --kdou-secondary: #eeffff;
  --kdou-accent: #289999;
  --kdou-inactive: #a1a1a1;
  --kdou-destructive: #900000;
  --font-family: "Inter", sans-serif;
}
```

---

## CSS Modules

For component-specific styles, use CSS modules.

Example:

```text
Header.tsx
Header.module.css
```

Import styles like this:

```tsx
import styles from "./Header.module.css";
```

Use them like this:

```tsx
<header className={styles.siteHeader}>...</header>
```

This prevents class name conflicts and keeps each component's styles isolated.

---

## Icons

All SVG icons are stored in:

```text
/apps/web/public/icons.svg
```

This file is an SVG sprite. It contains multiple icons defined as SVG symbols.

Examples of available icons:

```text
Address
ArrowRight
BottomMenu
CabMin
Catalog
Court
Date
Delete
Description
Education
Email
Filter
Frame
Home
Institutions
LawEnfAgencies
LeftArrow
LeftMenu
Look
Modify
News
Official-symbol
Phone
Regions
RegAdmin
RightMenu
Search
StateEnterpr
Website
Worker
Workers
```

---

## Icons Preview HTML

Available icons are shown in an HTML preview file instead of an image.

The preview file is located in the same README images folder:

```text
./ReadmeImgs/svg-sprite-preview.html
```

Open this file in a browser to see all available SVG symbols and test icon color/size behavior.

```text
apps/web/ReadmeImgs/svg-sprite-preview.html
```

The HTML preview is useful because:

- It shows all current icons from `icons.svg`
- It allows checking icons at different sizes
- It allows testing icon colors
- It confirms that icons using `currentColor` can be styled through CSS

---

## How Icons Work

The `icons.svg` file contains SVG symbols like this:

```xml
<symbol id="Home" viewBox="0 0 28 28">
  ...
</symbol>
```

To use an icon, reference its `id` through the reusable `Icon` component.

The shared icon component is located in:

```text
src/components/ui/Icon.tsx
```

Example:

```tsx
type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true">
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}
```

Usage example:

```tsx
<Icon name="Home" size={28} />
<Icon name="Catalog" size={28} />
<Icon name="Search" size={20} />
<Icon name="ArrowRight" size={24} />
<Icon name="Modify" size={20} />
<Icon name="Look" size={20} />
<Icon name="Delete" size={20} />
```

---

## Changing Icon Color

The icons use `currentColor`, so their color can be changed through CSS.

Example:

```css
.navLink {
  color: #ffffff;
}

.navLink:hover {
  color: var(--kdou-accent);
}
```

Because the SVG uses `currentColor`, the icon inherits the text color from the parent element.

Example for admin action icons:

```css
.editButton {
  color: var(--kdou-accent);
}

.viewButton {
  color: var(--kdou-accent);
}

.deleteButton {
  color: var(--kdou-destructive);
}
```

---

## Run the Front-End Project

Go to the front-end folder:

```bash
cd apps/web
```

Install dependencies:

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

The local development URL is usually:

```text
http://localhost:5173
```

---

## Build the Project

Before creating a pull request, run:

```bash
npm run build
```

This checks that the front-end compiles successfully.

To preview the production build:

```bash
npm run preview
```

---

## Deployment Notes

The frontend and backend are deployed as separate Render services.

Frontend Render URL example:

```text
https://state-authorities-app-1.onrender.com
```

Backend Render URL example:

```text
https://state-authorities-app.onrender.com/api
```

The frontend Render service must include this environment variable:

```text
VITE_API_URL=https://state-authorities-app.onrender.com/api
```

The backend Render service must include this environment variable:

```text
FRONTEND_URL=https://state-authorities-app-1.onrender.com
```

After adding or changing environment variables, redeploy the affected Render service.

---

## Git Workflow

Create a feature branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/SA-<ID>-<short-name>
```

Example:

```bash
git checkout -b feature/SA-29-api-client-web
```

Before committing, check the build:

```bash
cd apps/web
npm run build
```

Commit from the repository root:

```bash
cd ../..
git status
git add apps/web
git commit -m "feat: update web API client and institution pages"
git push origin feature/SA-<ID>-<short-name>
```

Open a pull request into:

```text
develop
```

---

## Front-End Checklist Before PR

Before opening a PR, check:

```bash
cd apps/web
npm run lint
npm run build
```

Checklist:

- Branch is based on `develop`
- PR targets `develop`
- Build passes
- Lint passes
- No `.env` secrets are committed
- `VITE_API_URL` is documented if deployment behavior changed
- `FRONTEND_URL` is documented if backend CORS/auth behavior changed
- UI was checked locally
- Icons were checked in the HTML sprite preview if new icons were added

---

## Development Notes

Implemented:

- Page routing
- Header
- Footer
- Home page
- Catalog page
- Institution details page
- Login page
- Protected Admin page
- Backend login/logout integration for admin authentication
- API client with `VITE_API_URL` support
- API client credential support through `withCredentials: true`
- Backend API integration for agencies
- Backend API integration for agency types
- Backend API integration for agency news
- Admin page prepared for backend create/update/delete operations
- Catalog search/filter/sort/pagination
- Loading, error, and empty states
- SVG sprite icon usage
- HTML preview for all available SVG icons

Partially implemented or future work:

- Complete real admin dashboard create/update/delete UI
- Add backend related-agencies endpoint if this feature returns
- Improve tests
- Continue accessibility improvements
