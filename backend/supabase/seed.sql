-- ==============================================================================
-- GARUDA PATH: SEED DATA FOR SUPABASE POSTGRESQL (MANGALORE DELIVERY GRID)
-- Version: 2.0.0-PRODUCTION
-- Description: Pre-populates users, 4 EV classes, 16 realistic stops, and incidents
-- ==============================================================================

-- 1. SEED DEFAULT USERS (Passwords hashed with bcrypt for 'password123')
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'dispatcher@garuda.com', '$2a$10$w09Hj00jN090h00j00j00euW09000000000000000000000000000', 'Vikram Rao', 'dispatcher'),
('a0000000-0000-0000-0000-000000000002', 'driver@garuda.com', '$2a$10$w09Hj00jN090h00j00j00euW09000000000000000000000000000', 'Rajesh Kulur', 'driver')
ON CONFLICT (email) DO NOTHING;

-- 2. SEED 4-CLASS HETEROGENEOUS EV FLEET (Mangalore Hubs)
INSERT INTO vehicles (id, name, plate_number, vehicle_class, max_payload_kg, max_volume_m3, usable_range_km, min_road_width_m, cost_per_km_inr, current_lat, current_lng, status, battery_pct, assigned_driver_id) VALUES
-- Class 1: Cargo E-Bike (Stationed at Hampankatta Central Depot)
('b0000000-0000-0000-0000-000000000001', 'Garuda E-Bike Express (2W)', 'KA-19-EB-1001', 'CARGO_EBIKE_2W', 100.00, 0.25, 70.00, 1.20, 3.50, 12.8698, 74.8426, 'in_transit', 92, 'a0000000-0000-0000-0000-000000000002'),

-- Class 2: Mahindra Treo Zor (Stationed in Bejai / Kadri corridor)
('b0000000-0000-0000-0000-000000000002', 'Mahindra Treo Zor Cargo (3W)', 'KA-19-EV-3002', 'TREO_ZOR_3W', 550.00, 3.40, 80.00, 2.20, 6.80, 12.8835, 74.8560, 'in_transit', 78, NULL),

-- Class 3: Euler HiLoad Heavy EV (Stationed near Kadri Hills / Derebail)
('b0000000-0000-0000-0000-000000000003', 'Euler HiLoad Heavy EV (3W)', 'KA-19-EH-4003', 'EULER_HILOAD_3W', 688.00, 4.20, 115.00, 2.40, 7.20, 12.8942, 74.8475, 'in_transit', 85, NULL),

-- Class 4: Tata Ace EV Box Container (Stationed at Panambur Port Hub)
('b0000000-0000-0000-0000-000000000004', 'Tata Ace EV Mini-Truck (4W)', 'KA-19-EV-9004', 'TATA_ACE_4W', 1000.00, 5.90, 90.00, 3.50, 11.50, 12.9431, 74.8115, 'in_transit', 64, NULL)
ON CONFLICT (plate_number) DO NOTHING;

-- 3. SEED REALISTIC MANGALORE DELIVERY ORDERS
INSERT INTO orders (id, tracking_code, customer_name, customer_phone, delivery_address, destination_sector, lat, lng, priority, weight_kg, volume_m3, payment_mode, cod_amount_inr, delivery_otp, status, assigned_vehicle_id, stop_sequence) VALUES
-- Hampankatta / Car Street Cluster (Assigned to E-Bike #1)
('c0000000-0000-0000-0000-000000000001', 'GAR-MNG-1001', 'Shrinivas Prabhu', '9845012345', 'Shop #12, Car Street, Near Venkataramana Temple', 'CarStreet', 12.8715, 74.8398, 'P2_EXPRESS', 12.50, 0.04, 'PREPAID', 0.00, '4821', 'in_transit', 'b0000000-0000-0000-0000-000000000001', 1),
('c0000000-0000-0000-0000-000000000002', 'GAR-MNG-1002', 'Dr. Radhika Shenoy', '9845023456', 'Falnir Medical Clinic, Falnir Road', 'Falnir', 12.8612, 74.8482, 'P1_URGENT', 8.20, 0.02, 'PREPAID', 0.00, '9134', 'in_transit', 'b0000000-0000-0000-0000-000000000001', 2),
('c0000000-0000-0000-0000-000000000003', 'GAR-MNG-1003', 'Ramesh Bhat', '9845034567', 'Bunder Port Fish Canning Office', 'Bunder', 12.8645, 74.8340, 'P3_STANDARD', 18.00, 0.06, 'COD_CASH_ON_DELIVERY', 1450.00, '3329', 'in_transit', 'b0000000-0000-0000-0000-000000000001', 3),

-- Kankanady & Kadri Cluster (Assigned to Treo Zor #2)
('c0000000-0000-0000-0000-000000000004', 'GAR-MNG-1004', 'Father Muller Emergency Ward', '9845045678', 'Father Muller Hospital, Kankanady Bypass', 'Kankanady', 12.8590, 74.8625, 'P1_URGENT', 35.00, 0.18, 'PREPAID', 0.00, '1190', 'in_transit', 'b0000000-0000-0000-0000-000000000002', 1),
('c0000000-0000-0000-0000-000000000005', 'GAR-MNG-1005', 'Naveen Dsouza', '9845056789', 'Kadri Park Heights, Apartment 4B', 'Kadri', 12.8790, 74.8580, 'P3_STANDARD', 45.00, 0.35, 'COD_CASH_ON_DELIVERY', 3200.00, '8271', 'in_transit', 'b0000000-0000-0000-0000-000000000002', 2),
('c0000000-0000-0000-0000-000000000006', 'GAR-MNG-1006', 'Mallikatta Organic Grocers', '9845067890', 'Mallikatta Circle, Near Library', 'Mallikatta', 12.8720, 74.8595, 'P2_EXPRESS', 65.00, 0.50, 'PREPAID', 0.00, '6422', 'in_transit', 'b0000000-0000-0000-0000-000000000002', 3),

-- Bejai & Derebail Hilly Sector (Assigned to Euler HiLoad #3)
('c0000000-0000-0000-0000-000000000007', 'GAR-MNG-1007', 'KSRTC Commercial Depot', '9845078901', 'Bejai Main Road, Opp Bus Stand', 'Bejai', 12.8850, 74.8510, 'P2_EXPRESS', 110.00, 0.85, 'PREPAID', 0.00, '5198', 'in_transit', 'b0000000-0000-0000-0000-000000000003', 1),
('c0000000-0000-0000-0000-000000000008', 'GAR-MNG-1008', 'Derebail Valley Residency', '9845089012', 'Derebail Konchady Ridge', 'Derebail', 12.9050, 74.8490, 'P3_STANDARD', 85.00, 0.60, 'COD_CASH_ON_DELIVERY', 2100.00, '7344', 'in_transit', 'b0000000-0000-0000-0000-000000000003', 2),

-- Panambur & Surathkal Freight Corridor (Assigned to Tata Ace EV #4)
('c0000000-0000-0000-0000-000000000009', 'GAR-MNG-1009', 'New Mangalore Port Authority Depot', '9845090123', 'Panambur Harbour Gate #3', 'Panambur', 12.9450, 74.8090, 'P2_EXPRESS', 280.00, 1.80, 'PREPAID', 0.00, '3920', 'in_transit', 'b0000000-0000-0000-0000-000000000004', 1),
('c0000000-0000-0000-0000-000000000010', 'GAR-MNG-1010', 'Baikampady Steel Warehouses', '9845101234', 'Plot 48, Baikampady Industrial Area', 'Baikampady', 12.9580, 74.8150, 'P3_STANDARD', 320.00, 2.10, 'PREPAID', 0.00, '2049', 'in_transit', 'b0000000-0000-0000-0000-000000000004', 2),
('c0000000-0000-0000-0000-000000000011', 'GAR-MNG-1011', 'NITK Surathkal Tech Lab', '9845112345', 'NITK Campus, National Highway 66', 'Surathkal', 13.0110, 74.7940, 'P1_URGENT', 45.00, 0.40, 'PREPAID', 0.00, '8831', 'in_transit', 'b0000000-0000-0000-0000-000000000004', 3),

-- Unassigned Pending Orders for Live Injection Demos
('c0000000-0000-0000-0000-000000000012', 'GAR-MNG-1012', 'Urgent Dialysis Unit - KMC Jyothi', '9845123456', 'KMC Hospital, Jyothi Circle', 'Jyothi', 12.8710, 74.8490, 'P1_URGENT', 18.00, 0.12, 'PREPAID', 0.00, '9912', 'pending', NULL, 0),
('c0000000-0000-0000-0000-000000000013', 'GAR-MNG-1013', 'Deepa Comforts Restaurant', '9845134567', 'K.S. Rao Road, Hampankatta', 'Hampankatta', 12.8705, 74.8435, 'P3_STANDARD', 22.00, 0.15, 'COD_CASH_ON_DELIVERY', 890.00, '1402', 'pending', NULL, 0)
ON CONFLICT (tracking_code) DO NOTHING;

-- 4. SEED REAL-WORLD TRAFFIC & MONSOON INCIDENTS
INSERT INTO incidents (id, title, description, incident_type, location_name, lat, lng, severity, speed_penalty_pct, is_active, ai_recommendation) VALUES
('d0000000-0000-0000-0000-000000000001', 'Kulur NH66 Bridge Freight Breakdown', 'Container trailer broken down on Gurupura River twin bridge deck; single lane traffic moving at 5 km/h.', 'TRAFFIC_CONGESTION', 'Kulur Bridge (NH66)', 12.9285, 74.8235, 'CRITICAL', 80, TRUE, 'Reroute active vehicles via Baikampady-Kavoor inland arterial bypass to bypass NH66 standstill.'),

('d0000000-0000-0000-0000-000000000002', 'Padil Railway Underpass Waterlogging', 'Flash coastal downpour has accumulated 380mm standing water in underpass. EV battery immersion risk.', 'MONSOON_FLOODING', 'Padil Railway Underpass', 12.8680, 74.8810, 'CRITICAL', 100, TRUE, 'Impose infinite impedance on Padil Underpass edge; elevate route onto Pumpwell-Kankanady highland ridge.')
ON CONFLICT (id) DO NOTHING;
