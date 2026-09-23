import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Vehicle, Order, Incident, User, VehicleRoutePlan } from '../types/index.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;
export let isSupabaseConnected = false;

// Initialize Supabase if valid URL and key are provided
if (supabaseUrl && !supabaseUrl.includes('your-project') && supabaseKey && !supabaseKey.includes('your_supabase')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    isSupabaseConnected = true;
    console.log('✅ Supabase PostgreSQL Client successfully connected.');
  } catch (err) {
    console.warn('⚠️ Supabase connection failed, falling back to in-memory active store:', err);
    supabase = null;
    isSupabaseConnected = false;
  }
} else {
  console.log('ℹ️ Supabase credentials pending in .env. Running with integrated Mangalore active memory store.');
}

// ==============================================================================
// IN-MEMORY / HYBRID DATA STORE (Seeds realistic Mangalore logistics dataset)
// ==============================================================================
export const dbStore = {
  users: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'dispatcher@garuda.com',
      password_hash: '$2a$10$w09Hj00jN090h00j00j00euW09000000000000000000000000000', // password123
      full_name: 'Vikram Rao',
      role: 'dispatcher' as const,
      created_at: new Date().toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      email: 'driver@garuda.com',
      password_hash: '$2a$10$w09Hj00jN090h00j00j00euW09000000000000000000000000000', // password123
      full_name: 'Rajesh Kulur',
      role: 'driver' as const,
      created_at: new Date().toISOString()
    }
  ] as User[],

  vehicles: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      name: 'Garuda E-Bike Express (2W)',
      plate_number: 'KA-19-EB-1001',
      vehicle_class: 'CARGO_EBIKE_2W' as const,
      max_payload_kg: 100.0,
      max_volume_m3: 0.25,
      usable_range_km: 70.0,
      min_road_width_m: 1.2,
      cost_per_km_inr: 3.5,
      current_lat: 12.8698,
      current_lng: 74.8426,
      status: 'in_transit' as const,
      battery_pct: 92,
      assigned_driver_id: 'a0000000-0000-0000-0000-000000000002'
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      name: 'Mahindra Treo Zor Cargo (3W)',
      plate_number: 'KA-19-EV-3002',
      vehicle_class: 'TREO_ZOR_3W' as const,
      max_payload_kg: 550.0,
      max_volume_m3: 3.4,
      usable_range_km: 80.0,
      min_road_width_m: 2.2,
      cost_per_km_inr: 6.8,
      current_lat: 12.8835,
      current_lng: 74.856,
      status: 'in_transit' as const,
      battery_pct: 78,
      assigned_driver_id: null
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      name: 'Euler HiLoad Heavy EV (3W)',
      plate_number: 'KA-19-EH-4003',
      vehicle_class: 'EULER_HILOAD_3W' as const,
      max_payload_kg: 688.0,
      max_volume_m3: 4.2,
      usable_range_km: 115.0,
      min_road_width_m: 2.4,
      cost_per_km_inr: 7.2,
      current_lat: 12.8942,
      current_lng: 74.8475,
      status: 'in_transit' as const,
      battery_pct: 85,
      assigned_driver_id: null
    },
    {
      id: 'b0000000-0000-0000-0000-000000000004',
      name: 'Tata Ace EV Mini-Truck (4W)',
      plate_number: 'KA-19-EV-9004',
      vehicle_class: 'TATA_ACE_4W' as const,
      max_payload_kg: 1000.0,
      max_volume_m3: 5.9,
      usable_range_km: 90.0,
      min_road_width_m: 3.5,
      cost_per_km_inr: 11.5,
      current_lat: 12.9431,
      current_lng: 74.8115,
      status: 'in_transit' as const,
      battery_pct: 64,
      assigned_driver_id: null
    }
  ] as Vehicle[],

  orders: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      tracking_code: 'GAR-MNG-1001',
      customer_name: 'Shrinivas Prabhu',
      customer_phone: '9845012345',
      delivery_address: 'Shop #12, Car Street, Near Venkataramana Temple',
      destination_sector: 'CarStreet',
      lat: 12.8715,
      lng: 74.8398,
      priority: 'P2_EXPRESS' as const,
      weight_kg: 12.5,
      volume_m3: 0.04,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '4821',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000001',
      stop_sequence: 1
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      tracking_code: 'GAR-MNG-1002',
      customer_name: 'Dr. Radhika Shenoy',
      customer_phone: '9845023456',
      delivery_address: 'Falnir Medical Clinic, Falnir Road',
      destination_sector: 'Falnir',
      lat: 12.8612,
      lng: 74.8482,
      priority: 'P1_URGENT' as const,
      weight_kg: 8.2,
      volume_m3: 0.02,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '9134',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000001',
      stop_sequence: 2
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      tracking_code: 'GAR-MNG-1003',
      customer_name: 'Ramesh Bhat',
      customer_phone: '9845034567',
      delivery_address: 'Bunder Port Fish Canning Office',
      destination_sector: 'Bunder',
      lat: 12.8645,
      lng: 74.834,
      priority: 'P3_STANDARD' as const,
      weight_kg: 18.0,
      volume_m3: 0.06,
      payment_mode: 'COD_CASH_ON_DELIVERY' as const,
      cod_amount_inr: 1450.0,
      delivery_otp: '3329',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000001',
      stop_sequence: 3
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      tracking_code: 'GAR-MNG-1004',
      customer_name: 'Father Muller Emergency Ward',
      customer_phone: '9845045678',
      delivery_address: 'Father Muller Hospital, Kankanady Bypass',
      destination_sector: 'Kankanady',
      lat: 12.859,
      lng: 74.8625,
      priority: 'P1_URGENT' as const,
      weight_kg: 35.0,
      volume_m3: 0.18,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '1190',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000002',
      stop_sequence: 1
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      tracking_code: 'GAR-MNG-1005',
      customer_name: 'Naveen Dsouza',
      customer_phone: '9845056789',
      delivery_address: 'Kadri Park Heights, Apartment 4B',
      destination_sector: 'Kadri',
      lat: 12.879,
      lng: 74.858,
      priority: 'P3_STANDARD' as const,
      weight_kg: 45.0,
      volume_m3: 0.35,
      payment_mode: 'COD_CASH_ON_DELIVERY' as const,
      cod_amount_inr: 3200.0,
      delivery_otp: '8271',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000002',
      stop_sequence: 2
    },
    {
      id: 'c0000000-0000-0000-0000-000000000006',
      tracking_code: 'GAR-MNG-1006',
      customer_name: 'Mallikatta Organic Grocers',
      customer_phone: '9845067890',
      delivery_address: 'Mallikatta Circle, Near Library',
      destination_sector: 'Mallikatta',
      lat: 12.872,
      lng: 74.8595,
      priority: 'P2_EXPRESS' as const,
      weight_kg: 65.0,
      volume_m3: 0.5,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '6422',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000002',
      stop_sequence: 3
    },
    {
      id: 'c0000000-0000-0000-0000-000000000007',
      tracking_code: 'GAR-MNG-1007',
      customer_name: 'KSRTC Commercial Depot',
      customer_phone: '9845078901',
      delivery_address: 'Bejai Main Road, Opp Bus Stand',
      destination_sector: 'Bejai',
      lat: 12.885,
      lng: 74.851,
      priority: 'P2_EXPRESS' as const,
      weight_kg: 110.0,
      volume_m3: 0.85,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '5198',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000003',
      stop_sequence: 1
    },
    {
      id: 'c0000000-0000-0000-0000-000000000008',
      tracking_code: 'GAR-MNG-1008',
      customer_name: 'Derebail Valley Residency',
      customer_phone: '9845089012',
      delivery_address: 'Derebail Konchady Ridge',
      destination_sector: 'Derebail',
      lat: 12.905,
      lng: 74.849,
      priority: 'P3_STANDARD' as const,
      weight_kg: 85.0,
      volume_m3: 0.6,
      payment_mode: 'COD_CASH_ON_DELIVERY' as const,
      cod_amount_inr: 2100.0,
      delivery_otp: '7344',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000003',
      stop_sequence: 2
    },
    {
      id: 'c0000000-0000-0000-0000-000000000009',
      tracking_code: 'GAR-MNG-1009',
      customer_name: 'New Mangalore Port Authority Depot',
      customer_phone: '9845090123',
      delivery_address: 'Panambur Harbour Gate #3',
      destination_sector: 'Panambur',
      lat: 12.945,
      lng: 74.809,
      priority: 'P2_EXPRESS' as const,
      weight_kg: 280.0,
      volume_m3: 1.8,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '3920',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000004',
      stop_sequence: 1
    },
    {
      id: 'c0000000-0000-0000-0000-000000000010',
      tracking_code: 'GAR-MNG-1010',
      customer_name: 'Baikampady Steel Warehouses',
      customer_phone: '9845101234',
      delivery_address: 'Plot 48, Baikampady Industrial Area',
      destination_sector: 'Baikampady',
      lat: 12.958,
      lng: 74.815,
      priority: 'P3_STANDARD' as const,
      weight_kg: 320.0,
      volume_m3: 2.1,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '2049',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000004',
      stop_sequence: 2
    },
    {
      id: 'c0000000-0000-0000-0000-000000000011',
      tracking_code: 'GAR-MNG-1011',
      customer_name: 'NITK Surathkal Tech Lab',
      customer_phone: '9845112345',
      delivery_address: 'NITK Campus, National Highway 66',
      destination_sector: 'Surathkal',
      lat: 13.011,
      lng: 74.794,
      priority: 'P1_URGENT' as const,
      weight_kg: 45.0,
      volume_m3: 0.4,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '8831',
      status: 'in_transit' as const,
      assigned_vehicle_id: 'b0000000-0000-0000-0000-000000000004',
      stop_sequence: 3
    },
    {
      id: 'c0000000-0000-0000-0000-000000000012',
      tracking_code: 'GAR-MNG-1012',
      customer_name: 'Urgent Dialysis Unit - KMC Jyothi',
      customer_phone: '9845123456',
      delivery_address: 'KMC Hospital, Jyothi Circle',
      destination_sector: 'Jyothi',
      lat: 12.871,
      lng: 74.849,
      priority: 'P1_URGENT' as const,
      weight_kg: 18.0,
      volume_m3: 0.12,
      payment_mode: 'PREPAID' as const,
      cod_amount_inr: 0,
      delivery_otp: '9912',
      status: 'pending' as const,
      assigned_vehicle_id: null,
      stop_sequence: 0
    },
    {
      id: 'c0000000-0000-0000-0000-000000000013',
      tracking_code: 'GAR-MNG-1013',
      customer_name: 'Deepa Comforts Restaurant',
      customer_phone: '9845134567',
      delivery_address: 'K.S. Rao Road, Hampankatta',
      destination_sector: 'Hampankatta',
      lat: 12.8705,
      lng: 74.8435,
      priority: 'P3_STANDARD' as const,
      weight_kg: 22.0,
      volume_m3: 0.15,
      payment_mode: 'COD_CASH_ON_DELIVERY' as const,
      cod_amount_inr: 890.0,
      delivery_otp: '1402',
      status: 'pending' as const,
      assigned_vehicle_id: null,
      stop_sequence: 0
    }
  ] as Order[],

  incidents: [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      title: 'Kulur NH66 Bridge Freight Breakdown',
      description: 'Container trailer broken down on Gurupura River twin bridge deck; single lane traffic moving at 5 km/h.',
      incident_type: 'TRAFFIC_CONGESTION' as const,
      location_name: 'Kulur Bridge (NH66)',
      lat: 12.9285,
      lng: 74.8235,
      severity: 'CRITICAL' as const,
      speed_penalty_pct: 80,
      is_active: true,
      ai_recommendation: 'Reroute active vehicles via Baikampady-Kavoor inland arterial bypass to bypass NH66 standstill.'
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      title: 'Padil Railway Underpass Waterlogging',
      description: 'Flash coastal downpour has accumulated 380mm standing water in underpass. EV battery immersion risk.',
      incident_type: 'MONSOON_FLOODING' as const,
      location_name: 'Padil Railway Underpass',
      lat: 12.868,
      lng: 74.881,
      severity: 'CRITICAL' as const,
      speed_penalty_pct: 100,
      is_active: true,
      ai_recommendation: 'Impose infinite impedance on Padil Underpass edge; elevate route onto Pumpwell-Kankanady highland ridge.'
    }
  ] as Incident[],

  routePlans: [] as VehicleRoutePlan[]
};
