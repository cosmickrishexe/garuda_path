import assert from 'node:assert';
import test from 'node:test';
import { CvrpSolver } from '../services/cvrp-solver.js';
import { dbStore } from '../config/db.js';

test('CVRP Solver respects vehicle payload capacity constraints', () => {
  const vehicles = dbStore.vehicles;
  const orders = dbStore.orders;
  const incidents = dbStore.incidents;

  const result = CvrpSolver.solve(vehicles, orders, incidents);

  assert.ok(result.routes.length > 0, 'Should generate route plans');

  for (const plan of result.routes) {
    assert.ok(
      plan.total_payload_kg <= plan.vehicle.max_payload_kg,
      `Vehicle ${plan.vehicle.name} payload ${plan.total_payload_kg} exceeds max ${plan.vehicle.max_payload_kg}`
    );
    assert.ok(
      plan.total_volume_m3 <= plan.vehicle.max_volume_m3,
      `Vehicle ${plan.vehicle.name} volume ${plan.total_volume_m3} exceeds max ${plan.vehicle.max_volume_m3}`
    );
  }
});

test('CVRP Solver allocates P1 urgent orders', () => {
  const vehicles = dbStore.vehicles;
  const orders = dbStore.orders;

  const result = CvrpSolver.solve(vehicles, orders);

  const p1Orders = orders.filter(o => o.priority === 'P1_URGENT');
  for (const p1 of p1Orders) {
    const isAssigned = result.routes.some(r => r.stops.some(s => s.order.id === p1.id));
    assert.ok(isAssigned, `P1 urgent order ${p1.customer_name} should be allocated`);
  }
});

test('CVRP Solver computes positive ESG CO2 savings and fuel savings', () => {
  const vehicles = dbStore.vehicles;
  const orders = dbStore.orders;

  const result = CvrpSolver.solve(vehicles, orders);

  assert.ok(result.system_metrics.total_co2_avoided_kg > 0, 'Should save CO2');
  assert.ok(result.system_metrics.total_diesel_saved_liters > 0, 'Should save diesel');
  assert.ok(result.system_metrics.total_money_saved_inr > 0, 'Should save expenditure');
});
