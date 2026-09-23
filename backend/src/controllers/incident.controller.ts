import { Request, Response } from 'express';
import { dbStore, supabase, isSupabaseConnected } from '../config/db.js';
import { GeminiService } from '../services/gemini.service.js';
import { CvrpSolver } from '../services/cvrp-solver.js';
import { Incident } from '../types/index.js';

export class IncidentController {
  public static async getAllIncidents(_req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: dbStore.incidents
    });
  }

  public static async simulateIncident(req: Request, res: Response): Promise<void> {
    const { incident_type, title, location_name, lat, lng, severity, speed_penalty_pct } = req.body;

    const newIncident: Incident = {
      id: `d0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      title,
      incident_type,
      location_name,
      lat,
      lng,
      severity,
      speed_penalty_pct,
      is_active: true,
      created_at: new Date().toISOString()
    };

    // Find nearby vehicles
    const affectedVehicles = dbStore.vehicles.filter(v => v.status === 'in_transit');

    // Get Gemini AI Disruption Impact Analysis
    const aiAnalysis = await GeminiService.analyzeDisruption(newIncident, affectedVehicles);
    newIncident.ai_recommendation = aiAnalysis.dispatcher_briefing;

    dbStore.incidents.push(newIncident);

    // Re-run CVRP optimization to dynamically bypass incident
    const reoptimized = CvrpSolver.solve(
      dbStore.vehicles,
      dbStore.orders.filter(o => o.status !== 'delivered'),
      dbStore.incidents.filter(i => i.is_active)
    );
    dbStore.routePlans = reoptimized.routes;

    if (isSupabaseConnected && supabase) {
      await supabase.from('incidents').insert({
        ...newIncident
      });
    }

    res.status(201).json({
      success: true,
      data: {
        incident: newIncident,
        ai_advisory: aiAnalysis,
        reoptimized_routes: reoptimized
      }
    });
  }

  public static async resolveIncident(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const incident = dbStore.incidents.find(i => i.id === id);

    if (!incident) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Incident not found' }
      });
      return;
    }

    incident.is_active = false;

    // Re-run CVRP optimization to restore normal road corridors
    const reoptimized = CvrpSolver.solve(
      dbStore.vehicles,
      dbStore.orders.filter(o => o.status !== 'delivered'),
      dbStore.incidents.filter(i => i.is_active)
    );
    dbStore.routePlans = reoptimized.routes;

    res.json({
      success: true,
      data: incident
    });
  }
}
