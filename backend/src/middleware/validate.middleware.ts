import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request payload',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
}

// Zod schemas
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  role: z.enum(['dispatcher', 'driver', 'admin']).default('dispatcher')
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const createOrderSchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number'),
  delivery_address: z.string().min(5),
  destination_sector: z.string().min(2),
  lat: z.number().min(12.7).max(13.1),
  lng: z.number().min(74.7).max(75.1),
  priority: z.enum(['P1_URGENT', 'P2_EXPRESS', 'P3_STANDARD']).default('P3_STANDARD'),
  weight_kg: z.number().positive().max(1000),
  volume_m3: z.number().positive().max(5.0),
  payment_mode: z.enum(['PREPAID', 'COD_CASH_ON_DELIVERY']).default('PREPAID'),
  cod_amount_inr: z.number().nonnegative().optional(),
  assigned_vehicle_id: z.string().uuid().optional()
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'dispatched', 'in_transit', 'delivered', 'failed', 'rescheduled']),
  delivery_otp: z.string().optional(),
  failure_reason: z.string().optional()
});

export const simulateIncidentSchema = z.object({
  incident_type: z.enum(['TRAFFIC_CONGESTION', 'MONSOON_FLOODING', 'ROAD_CLOSURE', 'ACCIDENT']),
  title: z.string().min(3),
  location_name: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  severity: z.enum(['CRITICAL', 'MODERATE', 'LOW']),
  speed_penalty_pct: z.number().min(0).max(100)
});

export const copilotChatSchema = z.object({
  message: z.string().min(1)
});
