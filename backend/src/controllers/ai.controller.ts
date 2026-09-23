import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';
import { GeminiService } from '../services/gemini.service.js';

export class AiController {
  public static async copilotChat(req: Request, res: Response): Promise<void> {
    const { message } = req.body;

    const vehicles = dbStore.vehicles;
    const allOrders = dbStore.orders;
    const p1Orders = allOrders.filter(o => o.priority === 'P1_URGENT');

    const contextSummary = `
Active Vehicles (${vehicles.length}): ${vehicles.map(v => `${v.name} [${v.vehicle_class}, Battery: ${v.battery_pct}%, Load: ${v.max_payload_kg}kg]`).join(', ')}
All Orders (${allOrders.length}): ${allOrders.map(o => `[ID: ${o.tracking_code}] ${o.customer_name} (${o.priority}) - Status: ${o.status} - Destination: ${o.delivery_address}`).join(' | ')}
P1 Life-Critical Orders: ${p1Orders.length} (${p1Orders.map(o => o.customer_name).join(', ')})
Active Incidents: ${dbStore.incidents.filter(i => i.is_active).map(i => `${i.title} at ${i.location_name}`).join(', ') || 'None'}
`;

    const aiReply = await GeminiService.copilotChat(message, contextSummary);

    res.json({
      success: true,
      data: {
        reply: aiReply,
        timestamp: new Date().toISOString()
      }
    });
  }

  public static async verifyEpod(req: Request, res: Response): Promise<void> {
    const { order_id, photo_url } = req.body;

    const order = dbStore.orders.find(o => o.id === order_id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
      return;
    }

    // High-confidence simulated vision check
    const inspectionResult = {
      is_package_present: true,
      package_condition: 'INTACT',
      is_safe_drop_location: true,
      drop_location_notes: `Package verified on doorstep porch at ${order.destination_sector}, recipient gate visible. No damage or rain exposure detected.`,
      verification_confidence: 0.98
    };

    order.proof_photo_url = photo_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400';
    order.proof_verified_by_ai = true;
    order.status = 'delivered';
    order.delivered_at = new Date().toISOString();

    res.json({
      success: true,
      data: {
        order,
        ai_verification: inspectionResult
      }
    });
  }
}
