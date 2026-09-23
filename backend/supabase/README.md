# Supabase Setup Guide for Garuda Path

To initialize your Supabase cloud PostgreSQL database for Garuda Path:

### Step 1: Open your Supabase Project
1. Log in to [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Select your project.

### Step 2: Run the Schema Migration
1. Go to the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of [`backend/supabase/schema.sql`](./schema.sql).
4. Paste it into the editor and click **Run**.
5. *Result*: All 5 tables (`users`, `vehicles`, `orders`, `incidents`, `route_plans`), performance indexes, RLS policies, and Realtime publications will be created.

### Step 3: Run the Seed Data
1. Click **New Query** in SQL Editor.
2. Copy the entire contents of [`backend/supabase/seed.sql`](./seed.sql).
3. Paste it into the editor and click **Run**.
4. *Result*: Pre-populates the 4 EV vehicles, 13 delivery orders across Mangalore, 2 real-world incidents, and default credentials.

### Step 4: Configure Backend Environment Variables
In your `backend/.env` file:
```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```
