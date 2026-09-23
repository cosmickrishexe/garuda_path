import { Request, Response } from 'express';
import { dbStore, supabase, isSupabaseConnected } from '../config/db.js';
import { CvrpSolver } from '../services/cvrp-solver.js';

export class OptimizeController {
  public static async optimizeRoutes(_req: Request, res: Response): Promise<void> {
    const vehicles = dbStore.vehicles;
    const orders = dbStore.orders.filter(o => o.status !== 'delivered' && o.status !== 'failed');
    const incidents = dbStore.incidents.filter(i => i.is_active);

    const result = CvrpSolver.solve(vehicles, orders, incidents);

    // Update in-memory state
    dbStore.routePlans = result.routes;

    // Update orders with their sequence and vehicle
    for (const route of result.routes) {
      for (const stop of route.stops) {
        const existing = dbStore.orders.find(o => o.id === stop.order.id);
        if (existing) {
          existing.assigned_vehicle_id = route.vehicle.id;
          existing.stop_sequence = stop.stop_sequence;
          existing.status = 'in_transit';
        }
      }
    }

    // If Supabase is connected, record route plans
    if (isSupabaseConnected && supabase) {
      for (const route of result.routes) {
        await supabase.from('route_plans').insert({
          vehicle_id: route.vehicle.id,
          waypoints_json: route.route_polyline_coordinates,
          total_distance_km: route.total_distance_km,
          total_duration_mins: route.total_duration_mins,
          fuel_saved_pct: route.fuel_saved_pct,
          co2_avoided_kg: route.co2_avoided_kg,
          money_saved_inr: route.money_saved_inr,
          algorithm_used: 'CVRPTW_2OPT'
        });
      }
    }

    res.json({
      success: true,
      data: result
    });
  }

  public static async getActiveRoutePlans(_req: Request, res: Response): Promise<void> {
    // If no route plans calculated yet, auto-run optimization once
    if (dbStore.routePlans.length === 0) {
      const vehicles = dbStore.vehicles;
      const orders = dbStore.orders.filter(o => o.status !== 'delivered');
      const incidents = dbStore.incidents.filter(i => i.is_active);
      const result = CvrpSolver.solve(vehicles, orders, incidents);
      dbStore.routePlans = result.routes;
    }

    res.json({
      success: true,
      data: dbStore.routePlans
    });
  }
}
