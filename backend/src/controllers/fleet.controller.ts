import { Request, Response } from 'express';
import { dbStore, supabase, isSupabaseConnected } from '../config/db.js';
import { Vehicle } from '../types/index.js';

export class FleetController {
  public static async getAllVehicles(_req: Request, res: Response): Promise<void> {
    let vehicles = dbStore.vehicles;

    if (isSupabaseConnected && supabase) {
      try {
        const { data, error } = await supabase.from('vehicles').select('*');
        if (!error && data && data.length > 0) {
          vehicles = data as Vehicle[];
        }
      } catch (err) {
        console.warn('Supabase query error, using local dataset:', err);
      }
    }

    res.json({
      success: true,
      data: vehicles
    });
  }

  public static async getVehicleById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const vehicle = dbStore.vehicles.find(v => v.id === id);

    if (!vehicle) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vehicle not found' }
      });
      return;
    }

    res.json({
      success: true,
      data: vehicle
    });
  }

  public static async updateTelemetry(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { current_lat, current_lng, battery_pct, status } = req.body;

    const vehicle = dbStore.vehicles.find(v => v.id === id);
    if (!vehicle) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vehicle not found' }
      });
      return;
    }

    if (current_lat !== undefined) vehicle.current_lat = current_lat;
    if (current_lng !== undefined) vehicle.current_lng = current_lng;
    if (battery_pct !== undefined) vehicle.battery_pct = battery_pct;
    if (status !== undefined) vehicle.status = status;

    if (isSupabaseConnected && supabase) {
      await supabase.from('vehicles').update({
        current_lat: vehicle.current_lat,
        current_lng: vehicle.current_lng,
        battery_pct: vehicle.battery_pct,
        status: vehicle.status
      }).eq('id', id);
    }

    res.json({
      success: true,
      data: vehicle
    });
  }
}
