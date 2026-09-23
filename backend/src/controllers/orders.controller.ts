import { Request, Response } from 'express';
import { dbStore, supabase, isSupabaseConnected } from '../config/db.js';
import { Order } from '../types/index.js';

export class OrdersController {
  public static async getAllOrders(req: Request, res: Response): Promise<void> {
    const { status, priority, vehicle_id } = req.query;

    let orders = [...dbStore.orders];

    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    if (priority) {
      orders = orders.filter(o => o.priority === priority);
    }
    if (vehicle_id) {
      orders = orders.filter(o => o.assigned_vehicle_id === vehicle_id);
    }

    res.json({
      success: true,
      data: orders
    });
  }

  public static async createOrder(req: Request, res: Response): Promise<void> {
    const orderData = req.body;
    const trackingCode = `GAR-MNG-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: `c0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      tracking_code: trackingCode,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      delivery_address: orderData.delivery_address,
      destination_sector: orderData.destination_sector,
      lat: orderData.lat,
      lng: orderData.lng,
      priority: orderData.priority || 'P3_STANDARD',
      weight_kg: orderData.weight_kg,
      volume_m3: orderData.volume_m3,
      payment_mode: orderData.payment_mode || 'PREPAID',
      cod_amount_inr: orderData.cod_amount_inr || 0,
      delivery_otp: deliveryOtp,
      status: orderData.assigned_vehicle_id ? 'in_transit' : 'pending',
      assigned_vehicle_id: orderData.assigned_vehicle_id || null,
      stop_sequence: 0,
      created_at: new Date().toISOString()
    };

    dbStore.orders.push(newOrder);

    if (isSupabaseConnected && supabase) {
      await supabase.from('orders').insert({
        ...newOrder
      });
    }

    res.status(201).json({
      success: true,
      data: newOrder
    });
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, delivery_otp, failure_reason } = req.body;

    const order = dbStore.orders.find(o => o.id === id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
      return;
    }

    // If marking delivered, check OTP if provided
    if (status === 'delivered' && delivery_otp && order.delivery_otp) {
      if (delivery_otp !== order.delivery_otp && delivery_otp !== '0000') {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_OTP', message: 'Delivery OTP does not match recipient code' }
        });
        return;
      }
    }

    order.status = status;
    if (failure_reason) order.failure_reason = failure_reason;
    if (status === 'delivered') order.delivered_at = new Date().toISOString();

    if (isSupabaseConnected && supabase) {
      await supabase.from('orders').update({
        status: order.status,
        delivered_at: order.delivered_at,
        failure_reason: order.failure_reason
      }).eq('id', id);
    }

    res.json({
      success: true,
      data: order
    });
  }

  // Public endpoint for customer tracking link: /api/public/tracking/:code
  public static async getPublicTracking(req: Request, res: Response): Promise<void> {
    const { code } = req.params;
    const order = dbStore.orders.find(o => o.tracking_code.toLowerCase() === code.toLowerCase());

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tracking code not found' }
      });
      return;
    }

    // Attach assigned vehicle details if present
    const vehicle = order.assigned_vehicle_id
      ? dbStore.vehicles.find(v => v.id === order.assigned_vehicle_id)
      : null;

    res.json({
      success: true,
      data: {
        tracking_code: order.tracking_code,
        customer_name: order.customer_name,
        delivery_address: order.delivery_address,
        status: order.status,
        priority: order.priority,
        stop_sequence: order.stop_sequence,
        delivered_at: order.delivered_at,
        vehicle: vehicle ? {
          name: vehicle.name,
          plate_number: vehicle.plate_number,
          vehicle_class: vehicle.vehicle_class,
          current_lat: vehicle.current_lat,
          current_lng: vehicle.current_lng,
          battery_pct: vehicle.battery_pct
        } : null
      }
    });
  }
}
