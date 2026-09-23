import axios from 'axios';
import { 
  User, 
  Vehicle, 
  Order, 
  Incident, 
  OptimizationResult, 
  VehicleRoutePlan 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('garuda_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: { email: string; password: string; full_name: string; role: string }) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Fleet
  getVehicles: async (): Promise<Vehicle[]> => {
    const res = await apiClient.get('/fleet');
    return res.data.data;
  },
  updateTelemetry: async (id: string, telemetry: Partial<Vehicle>) => {
    const res = await apiClient.patch(`/fleet/${id}/telemetry`, telemetry);
    return res.data.data;
  },

  // Orders
  getOrders: async (params?: { status?: string; priority?: string }): Promise<Order[]> => {
    const res = await apiClient.get('/orders', { params });
    return res.data.data;
  },
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const res = await apiClient.post('/orders', orderData);
    return res.data.data;
  },
  updateOrderStatus: async (id: string, update: { status: string; delivery_otp?: string }) => {
    const res = await apiClient.patch(`/orders/${id}/status`, update);
    return res.data.data;
  },
  getPublicTracking: async (code: string) => {
    const res = await apiClient.get(`/orders/public/tracking/${code}`);
    return res.data.data;
  },

  // Optimization
  optimizeRoutes: async (): Promise<OptimizationResult> => {
    const res = await apiClient.post('/optimize');
    return res.data.data;
  },
  getActiveRoutePlans: async (): Promise<VehicleRoutePlan[]> => {
    const res = await apiClient.get('/optimize/plans');
    return res.data.data;
  },

  // Incidents & Simulations
  getIncidents: async (): Promise<Incident[]> => {
    const res = await apiClient.get('/incidents');
    return res.data.data;
  },
  simulateIncident: async (incident: Partial<Incident>) => {
    const res = await apiClient.post('/incidents/simulate', incident);
    return res.data.data;
  },
  resolveIncident: async (id: string) => {
    const res = await apiClient.post(`/incidents/${id}/resolve`);
    return res.data.data;
  },

  // AI Copilot
  copilotChat: async (message: string): Promise<string> => {
    const res = await apiClient.post('/ai/copilot-chat', { message });
    return res.data.data.reply;
  },
  verifyEpod: async (orderId: string, photoUrl?: string) => {
    const res = await apiClient.post('/ai/verify-epod', { order_id: orderId, photo_url: photoUrl });
    return res.data.data;
  }
};
