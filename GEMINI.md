# AGENTS.md — Garuda Path AI Rules & Development Standards

## Project: Garuda Path (AI for Smart Mobility)
Intelligent, reactive fleet dispatching and dynamic route optimization engine designed for urban and semi-urban delivery operations in Mangalore.

## Tech Stack
- **Frontend**: React.js 18, Vite, React Router, Tailwind CSS, Lucide Icons, Mapbox GL JS, Axios
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`) with real-time subscriptions
- **Security & Auth**: JWT authentication, bcrypt password hashing, Zod schema validation
- **Artificial Intelligence**: Google Gemini API (`GEMINI_API_KEY` stored exclusively in backend `.env`)

---

## Core Engineering Rules (Vibe Coding Framework)

### 1. Problem Clarity First (PCF) & Think Before Coding
- Never guess business logic or routing requirements.
- Follow the sequence: **Intent → Context → Strategy → Risk**.
- Ground all spatial calculations in the Mangalore urban/semi-urban delivery grid (Hampankatta, Panambur, Surathkal, Kadri, Kankanady).

### 2. Simplicity First (SF) & Dependency Minimalism
- Choose the simplest viable solution. No speculative abstractions for single-use routines.
- Strictly adhere to the approved hackathon tech stack. Do not introduce unauthorized external dependencies.

### 3. Surgical Changes (SC) & Atomic Edits
- Complete one file and one module before moving to the next.
- Preserve existing comments, docstrings, and formatting. Touch only the lines required for the specific task.

### 4. Mandatory Quality Gates
Never mark a task complete without executing the quality gate chain:
1. `npm run build` (Clean compile without type errors)
2. Schema & Unit verification (CVRP constraints, priority penalty ordering, auth token issuance)
3. Server smoke test (Health check endpoints `/api/health` and live simulation triggers)

### 5. Security Guardrails
- **Zero Secret Exposure**: NEVER put Google Gemini keys, Mapbox secret keys, or Supabase Service Role keys in client-side code or public git commits.
- **Supabase Credentials**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` stored securely in backend `.env`.
- **Strict Input Validation**: Every incoming Express request body must pass through a Zod schema middleware.

---

## Key Directories & Architecture
- `backend/src/config/`: Supabase client initialization and environment configuration
- `backend/src/controllers/`: Route handlers for auth, fleet, orders, optimize, and AI
- `backend/src/services/`: CVRPTW solver, 2-Opt heuristic, Gemini AI mobility engine, Supabase real-time sync
- `frontend/src/components/map/`: Mapbox GL JS map canvas, route polylines, and live vehicle markers
- `frontend/src/components/dashboard/`: Dispatcher Command Center, incident simulator, and metrics cards
- `garuda_memory.md`: Graphify-indexed persistent domain memory
