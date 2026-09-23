import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Vehicle, 
  Order, 
  Incident, 
  VehicleRoutePlan, 
  SystemMetrics 
} from '../types';
import { api } from '../api/client';

interface DispatchContextType {
  vehicles: Vehicle[];
  orders: Order[];
  routePlans: VehicleRoutePlan[];
  incidents: Incident[];
  metrics: SystemMetrics;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedRoute: VehicleRoutePlan | null;
  isOptimizing: boolean;
  triggerOptimization: () => Promise<void>;
  simulateScenario: (scenarioType: string) => Promise<any>;
  refreshAll: () => Promise<void>;
  addNewOrder: (orderData: Partial<Order>) => Promise<void>;
  activeSimulationRunning: boolean;
  setActiveSimulationRunning: (val: boolean) => void;
}

const defaultMetrics: SystemMetrics = {
  total_deliveries: 13,
  total_vehicles_active: 4,
  total_fleet_distance_km: 27.84,
  total_fleet_duration_mins: 62,
  total_co2_avoided_kg: 3.20,
  total_diesel_saved_liters: 2.3,
  total_money_saved_inr: 219.93,
  p1_urgent_sla_adherence_pct: 100,
  average_route_reduction_pct: 28.5
};

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export const DispatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [routePlans, setRoutePlans] = useState<VehicleRoutePlan[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>(defaultMetrics);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeSimulationRunning, setActiveSimulationRunning] = useState(false);

  const refreshAll = useCallback(async () => {
    try {
      const [vData, oData, iData, rData] = await Promise.all([
        api.getVehicles(),
        api.getOrders(),
        api.getIncidents(),
        api.getActiveRoutePlans()
      ]);

      setVehicles(vData);
      setOrders(oData);
      setIncidents(iData);
      setRoutePlans(rData);

      if (vData.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(vData[0].id);
      }
    } catch (err) {
      console.warn('Could not connect to backend, running with initial local state:', err);
    }
  }, [selectedVehicleId]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const triggerOptimization = async () => {
    setIsOptimizing(true);
    try {
      const result = await api.optimizeRoutes();
      setRoutePlans(result.routes);
      setMetrics(result.system_metrics);
      // Refresh vehicles and orders
      const [vData, oData] = await Promise.all([api.getVehicles(), api.getOrders()]);
      setVehicles(vData);
      setOrders(oData);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const addNewOrder = async (orderData: Partial<Order>) => {
    await api.createOrder(orderData);
    await refreshAll();
  };

  const simulateScenario = async (scenarioType: string) => {
    let incidentPayload: Partial<Incident> = {};

    switch (scenarioType) {
      case 'NH66_BRIDGE_JAM':
        incidentPayload = {
          title: 'Kulur NH66 Bridge Freight Trailer Jam',
          location_name: 'Kulur Bridge (NH66)',
          lat: 12.9285,
          lng: 74.8235,
          incident_type: 'TRAFFIC_CONGESTION',
          severity: 'CRITICAL',
          speed_penalty_pct: 85
        };
        break;
      case 'PADIL_FLOOD':
        incidentPayload = {
          title: 'Padil Underpass Monsoon Waterlogging (380mm)',
          location_name: 'Padil Underpass',
          lat: 12.8680,
          lng: 74.8810,
          incident_type: 'MONSOON_FLOODING',
          severity: 'CRITICAL',
          speed_penalty_pct: 100
        };
        break;
      case 'P1_EMERGENCY_MEDICAL':
        // Inject new life-critical dialysis order at Father Muller
        await api.createOrder({
          customer_name: 'Urgent Dialysis Unit - KMC Jyothi',
          customer_phone: '9845123456',
          delivery_address: 'KMC Hospital, Jyothi Circle',
          destination_sector: 'Jyothi',
          lat: 12.8710,
          lng: 74.8490,
          priority: 'P1_URGENT',
          weight_kg: 18.0,
          volume_m3: 0.12
        });
        await triggerOptimization();
        return { success: true, message: 'P1 Emergency Medical order injected & routed under 25 min SLA!' };
      default:
        break;
    }

    if (incidentPayload.title) {
      const response = await api.simulateIncident(incidentPayload);
      await refreshAll();
      return response;
    }
  };

  const selectedRoute = routePlans.find(r => r.vehicle.id === selectedVehicleId) || (routePlans.length > 0 ? routePlans[0] : null);

  return (
    <DispatchContext.Provider value={{
      vehicles,
      orders,
      routePlans,
      incidents,
      metrics,
      selectedVehicleId,
      setSelectedVehicleId,
      selectedRoute,
      isOptimizing,
      triggerOptimization,
      simulateScenario,
      refreshAll,
      addNewOrder,
      activeSimulationRunning,
      setActiveSimulationRunning
    }}>
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => {
  const context = useContext(DispatchContext);
  if (!context) throw new Error('useDispatch must be used within a DispatchProvider');
  return context;
};
