import React from 'react';
import { useDispatch } from '../../context/DispatchContext';
import { Battery, Zap, Truck, Navigation2, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../../types';

export const FleetDrawer: React.FC = () => {
  const { vehicles, routePlans, selectedVehicleId, setSelectedVehicleId } = useDispatch();

  const getClassIcon = (vClass: string) => {
    switch (vClass) {
      case 'CARGO_EBIKE_2W': return '🛵 2W';
      case 'TREO_ZOR_3W': return '🛺 3W';
      case 'EULER_HILOAD_3W': return '⚡ 3W Heavy';
      case 'TATA_ACE_4W': return '🚚 4W LCV';
      default: return '🚗';
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Active EV Fleet ({vehicles.length})</span>
        </h2>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
          100% Zero-Emission
        </span>
      </div>

      <div className="space-y-3 mt-3 overflow-y-auto pr-1 flex-1">
        {vehicles.map((vehicle) => {
          const plan = routePlans.find(r => r.vehicle.id === vehicle.id);
          const isSelected = vehicle.id === selectedVehicleId;
          const assignedPayload = plan ? plan.total_payload_kg : 0;
          const payloadPct = Math.min(100, Math.round((assignedPayload / vehicle.max_payload_kg) * 100));

          return (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicleId(vehicle.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {getClassIcon(vehicle.vehicle_class)}
                  </span>
                  <span className="font-semibold text-xs text-white truncate max-w-[130px]">
                    {vehicle.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {vehicle.plate_number.slice(-4)}
                </span>
              </div>

              {/* Telemetry & Battery */}
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                {/* Battery Gauge */}
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Battery className={`w-3.5 h-3.5 ${vehicle.battery_pct < 20 ? 'text-red-400' : 'text-emerald-400'}`} />
                  <span>SoC: <strong className="text-white font-mono">{vehicle.battery_pct}%</strong></span>
                </div>

                {/* Assigned Stops */}
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stops: <strong className="text-white font-mono">{plan ? plan.stops.length : 0}</strong></span>
                </div>
              </div>

              {/* Payload Capacity Bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Payload: {assignedPayload} kg</span>
                  <span>{payloadPct}% of {vehicle.max_payload_kg} kg</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      payloadPct > 90 ? 'bg-red-500' : payloadPct > 70 ? 'bg-yellow-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${payloadPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
