export type Role = 'dispatcher' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
}

export type VehicleClass = 
  | 'CARGO_EBIKE_2W'
  | 'TREO_ZOR_3W'
  | 'EULER_HILOAD_3W'
  | 'TATA_ACE_4W';

export type VehicleStatus = 
  | 'idle'
  | 'in_transit'
  | 'delayed'
  | 'charging'
  | 'maintenance';

export interface Vehicle {
  id: string;
  name: string;
  plate_number: string;
  vehicle_class: VehicleClass;
  max_payload_kg: number;
  max_volume_m3: number;
  usable_range_km: number;
  min_road_width_m: number;
  cost_per_km_inr: number;
  current_lat: number;
  current_lng: number;
  status: VehicleStatus;
  battery_pct: number;
  assigned_driver_id?: string | null;
}

export type OrderPriority = 'P1_URGENT' | 'P2_EXPRESS' | 'P3_STANDARD';

export type OrderStatus = 
  | 'pending'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'rescheduled';

export type PaymentMode = 'PREPAID' | 'COD_CASH_ON_DELIVERY';

export interface Order {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  destination_sector: string;
  lat: number;
  lng: number;
  priority: OrderPriority;
  weight_kg: number;
  volume_m3: number;
  payment_mode: PaymentMode;
  cod_amount_inr?: number;
  delivery_otp?: string;
  status: OrderStatus;
  assigned_vehicle_id?: string | null;
  stop_sequence?: number;
  proof_photo_url?: string;
  proof_verified_by_ai?: boolean;
  failure_reason?: string;
  delivered_at?: string;
}

export type IncidentType = 
  | 'TRAFFIC_CONGESTION'
  | 'MONSOON_FLOODING'
  | 'ROAD_CLOSURE'
  | 'ACCIDENT';

export type IncidentSeverity = 'CRITICAL' | 'MODERATE' | 'LOW';

export interface Incident {
  id: string;
  title: string;
  description?: string;
  incident_type: IncidentType;
  location_name: string;
  lat: number;
  lng: number;
  severity: IncidentSeverity;
  speed_penalty_pct: number;
  is_active: boolean;
  ai_recommendation?: string;
}

export interface NavigationStep {
  instruction: string;
  distance_meters: number;
  duration_seconds: number;
  maneuver_type: 'turn-left' | 'turn-right' | 'roundabout' | 'keep-straight' | 'merge' | 'destination-arrival';
  street_name?: string;
}

export interface OptimizedStop {
  order: Order;
  stop_sequence: number;
  distance_from_prev_km: number;
  estimated_travel_time_mins: number;
  cumulative_distance_km: number;
  cumulative_duration_mins: number;
  estimated_arrival_time: string;
  navigation_steps: NavigationStep[];
}

export interface VehicleRoutePlan {
  vehicle: Vehicle;
  depot_location: { name: string; lat: number; lng: number };
  stops: OptimizedStop[];
  total_distance_km: number;
  total_duration_mins: number;
  total_payload_kg: number;
  total_volume_m3: number;
  payload_utilization_pct: number;
  volume_utilization_pct: number;
  battery_consumed_pct: number;
  remaining_battery_pct: number;
  co2_avoided_kg: number;
  fuel_saved_pct: number;
  money_saved_inr: number;
  route_polyline_coordinates: [number, number][]; // [lng, lat]
}

export interface SystemMetrics {
  total_deliveries: number;
  total_vehicles_active: number;
  total_fleet_distance_km: number;
  total_fleet_duration_mins: number;
  total_co2_avoided_kg: number;
  total_diesel_saved_liters: number;
  total_money_saved_inr: number;
  p1_urgent_sla_adherence_pct: number;
  average_route_reduction_pct: number;
}

export interface OptimizationResult {
  routes: VehicleRoutePlan[];
  unassigned_orders: Order[];
  system_metrics: SystemMetrics;
}
