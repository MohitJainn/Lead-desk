# LeadDesk Mini

A small lead-capture app with a public landing page and a protected admin dashboard, built for the Digital Heroes Full Stack Development qualification task.

**Live URLs**
- Public site: https://lead-desk-lime-nu.vercel.app
- Admin: https://lead-desk-lime-nu.vercel.app/admin
- Backend API: https://lead-desk-j6eg.onrender.com
**Test credentials (admin login)**
- Email: `admin@leaddesk.com`
- Password: `Admin@12345`


---

## Setup 

**Frontend**
```bash
cd client
npm install
# create a .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_URL=http://localhost:5000
npm run dev
```

**Backend**
```bash
cd server
npm install
# create a .env file with:
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# PORT=5000
node index.js
```

**Database**
Run the SQL in `schema.sql` (or the SQL editor in Supabase) to create the `leads` table and its row-level security policies.

---

## API Contract

### `POST /api/leads`

Creates a new lead. Used by the public landing page form.

**Request body**
```json
{
  "name": "string, required",
  "email": "string, required, must be a valid email format",
  "budget_range": "string, required",
  "message": "string, optional"
}
```

**Responses**
- `201 Created` — `{ "success": true }`
- `400 Bad Request` — `{ "error": "<validation message>" }` (missing/invalid name, email, or budget range)
- `500 Internal Server Error` — `{ "error": "Failed to save lead" }`

Reads and status updates on the admin side go directly through the Supabase client SDK (authenticated requests only, enforced by row-level security), rather than through a custom REST endpoint.

---

## Design Decisions

**1. Supabase for the database and auth, instead of a fully custom backend.**
I already had hands-on experience with Supabase Auth from an earlier project, so it let me move fast without sacrificing correctness. It also meant I didn't have to hand-roll session/token handling for the admin login — Supabase manages that securely out of the box.

**2. A thin Express layer just for the public-facing write (`POST /api/leads`), while admin reads/updates go directly through the Supabase client SDK.**
The task specifically asks for server-side validation on lead submission, so that path goes through a real backend endpoint that validates input before writing to the database — this can't be bypassed by disabling JavaScript validation in the browser. The admin dashboard, on the other hand, only needs to enforce *who* can access data, which Supabase's row-level security policies already handle cleanly without needing a duplicate backend layer.

**3. Row-level security policies over hardcoded backend checks.**
Rather than writing custom "is this user an admin" logic in application code, I used Supabase's RLS policies directly on the `leads` table: anonymous users can only `insert`, authenticated users can `select` and `update`. This keeps the access rules enforced at the database layer itself, so they can't accidentally be bypassed by a bug in the frontend or backend code.

---

## What I'd change with another day

Given more time, I'd add pagination to the admin leads table (currently loads everything at once, which won't scale past a small number of leads), and move the admin status updates through the same Express backend (with proper server-side authorization checks) rather than calling Supabase directly from the client, for a more consistent API surface.

---

## A note on AI usage

I used AI assistance (Claude) throughout this build — for scaffolding the initial component structure, debugging deployment issues (a git nested-repo problem, a Vite/react-router-dom caching issue, and a Render root-directory misconfiguration), and reviewing my code for bugs (e.g., a missing `e.preventDefault()` and unused validation call in the form handler that I fixed after review). I wrote and tested the actual logic myself, and can explain the reasoning behind each design decision above — the auth flow and CORS/env var handling in particular mirror patterns I built and debugged from scratch in an earlier full-stack project of mine.
