-- ==============================================================================
-- GARUDA PATH: PRODUCTION DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Version: 2.0.0-PRODUCTION
-- Description: Complete DDL with Row Level Security, Indexes, and Realtime sync
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES IF RE-RUNNING (Safe migration order)
-- DROP TABLE IF EXISTS route_plans CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS incidents CASCADE;
-- DROP TABLE IF EXISTS vehicles CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ==============================================================================
-- 3. USERS TABLE (Dispatchers, Drivers, Admins)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('dispatcher', 'driver', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. VEHICLES TABLE (Heterogeneous 4-Class Clean EV Fleet)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_class VARCHAR(30) NOT NULL CHECK (
        vehicle_class IN ('CARGO_EBIKE_2W', 'TREO_ZOR_3W', 'EULER_HILOAD_3W', 'TATA_ACE_4W')
    ),
    max_payload_kg NUMERIC(8, 2) NOT NULL,
    max_volume_m3 NUMERIC(8, 2) NOT NULL,
    usable_range_km NUMERIC(8, 2) NOT NULL,
    min_road_width_m NUMERIC(4, 2) NOT NULL,
    cost_per_km_inr NUMERIC(6, 2) NOT NULL,
    current_lat NUMERIC(10, 7) NOT NULL,
    current_lng NUMERIC(10, 7) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'idle' CHECK (
        status IN ('idle', 'in_transit', 'delayed', 'charging', 'maintenance')
    ),
    battery_pct INT NOT NULL DEFAULT 100 CHECK (battery_pct >= 0 AND battery_pct <= 100),
    assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. ORDERS / DELIVERY STOPS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    destination_sector VARCHAR(50) NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'P3_STANDARD' CHECK (
        priority IN ('P1_URGENT', 'P2_EXPRESS', 'P3_STANDARD')
    ),
    weight_kg NUMERIC(8, 2) NOT NULL,
    volume_m3 NUMERIC(8, 2) NOT NULL,
    time_window_start TIMESTAMP WITH TIME ZONE,
    time_window_end TIMESTAMP WITH TIME ZONE,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'PREPAID' CHECK (
        payment_mode IN ('PREPAID', 'COD_CASH_ON_DELIVERY')
    ),
    cod_amount_inr NUMERIC(10, 2) DEFAULT 0.00,
    delivery_otp VARCHAR(6),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'dispatched', 'in_transit', 'delivered', 'failed', 'rescheduled')
    ),
    assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    stop_sequence INT DEFAULT 0,
    proof_photo_url TEXT,
    proof_verified_by_ai BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. ROAD INCIDENTS & CONGESTION TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    incident_type VARCHAR(40) NOT NULL CHECK (
        incident_type IN ('TRAFFIC_CONGESTION', 'MONSOON_FLOODING', 'ROAD_CLOSURE', 'ACCIDENT')
    ),
    location_name VARCHAR(100) NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MODERATE' CHECK (
        severity IN ('CRITICAL', 'MODERATE', 'LOW')
    ),
    speed_penalty_pct INT DEFAULT 50 CHECK (speed_penalty_pct >= 0 AND speed_penalty_pct <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ai_recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 7. ROUTE PLANS & OPTIMIZATION AUDIT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS route_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    waypoints_json JSONB NOT NULL,
    total_distance_km NUMERIC(8, 2) NOT NULL,
    total_duration_mins NUMERIC(8, 2) NOT NULL,
    fuel_saved_pct NUMERIC(5, 2) DEFAULT 0.00,
    co2_avoided_kg NUMERIC(8, 3) DEFAULT 0.000,
    money_saved_inr NUMERIC(10, 2) DEFAULT 0.00,
    algorithm_used VARCHAR(50) DEFAULT 'CVRPTW_2OPT',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_priority ON orders(priority);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_vehicle ON orders(assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_incidents_active ON incidents(is_active);
CREATE INDEX IF NOT EXISTS idx_route_plans_vehicle ON route_plans(vehicle_id);

-- ==============================================================================
-- 9. ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
-- Enables instant WebSocket broadcasts when orders, vehicles, or incidents change
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE route_plans;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_plans ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated read for hackathon demo simplicity
CREATE POLICY "Public read all vehicles" ON vehicles FOR SELECT USING (TRUE);
CREATE POLICY "Public update vehicles" ON vehicles FOR ALL USING (TRUE);

CREATE POLICY "Public read all orders" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "Public manage orders" ON orders FOR ALL USING (TRUE);

CREATE POLICY "Public read all incidents" ON incidents FOR SELECT USING (TRUE);
CREATE POLICY "Public manage incidents" ON incidents FOR ALL USING (TRUE);

CREATE POLICY "Public read route plans" ON route_plans FOR SELECT USING (TRUE);
CREATE POLICY "Public manage route plans" ON route_plans FOR ALL USING (TRUE);

CREATE POLICY "Public manage users" ON users FOR ALL USING (TRUE);
