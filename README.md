# Theme Chat Milestone

A minimal, testable milestone for a theme-based chat platform. The backend is built with Django REST Framework, OAuth-only authentication, and JWT issuance. The frontend is a Vite + React + TypeScript application styled with Tailwind CSS.

## Project Layout

- `server/` – Django REST API (OAuth-only auth, rooms/messages endpoints, seed command)
- `web/` – Vite + React single-page app (routing, auth handling, placeholder chat UIs)

## Requirements

- Python 3.11+
- Node.js 18+
- MySQL 8+ with `utf8mb4` collation (`mysqlclient` system deps are required on the host machine)

> ℹ️ For local development without MySQL, set `ALLOW_SQLITE_FALLBACK=True` in `.env`. SQLite should only be used for development/testing.

## Backend Quick Start

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # mysqlclient needs libmysqlclient headers installed
cp .env.example .env             # update OAuth keys & DB settings
make migrate                     # applies migrations (uses sqlite fallback if enabled)
make seed                        # optional: demo rooms/messages for local dev
make runserver                   # serves API at http://127.0.0.1:8000/
```

Useful commands:

- `make install` – recreate the virtualenv and install dependencies
- `make test` – run Django unit tests (API smoke tests)

## Frontend Quick Start

```bash
cd web
npm install
npm run dev       # http://127.0.0.1:5173 with Vite dev server
```

Additional scripts:

- `npm run build` – type-check and produce a production build
- `npm run preview` – preview the production build

## OAuth Configuration Notes

1. Add provider credentials in Django admin → **Social Accounts → Social applications** for Google/GitHub.
2. Set the provider redirect URI to `http://127.0.0.1:8000/api/auth/<provider>/callback/`.
3. Ensure `.env` includes:
   - `OAUTH_REDIRECT_URI=http://127.0.0.1:8000/api/auth/social/redirect/`
   - `OAUTH_FRONTEND_CALLBACK=http://127.0.0.1:5173/oauth/callback`

After successful OAuth login the backend issues SimpleJWT access/refresh tokens, blacklists refresh tokens on logout, and redirects back to the SPA.

Backend API smoke tests (`make test`) and frontend build (`npm run build`) are run as part of this milestone.
