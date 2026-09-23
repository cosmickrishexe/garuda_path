import React from 'react';
import { useDispatch } from '../../context/DispatchContext';
import { Leaf, Fuel, TrendingDown, IndianRupee, ShieldCheck } from 'lucide-react';

export const EsgCarbonTicker: React.FC = () => {
  const { metrics } = useDispatch();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* CO2 Avoided */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center space-x-3 shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">CO₂ Emissions Avoided</span>
          <span className="text-lg font-black text-emerald-400 font-mono tracking-tight">
            +{metrics.total_co2_avoided_kg} <span className="text-xs font-normal text-slate-400">kg</span>
          </span>
        </div>
      </div>

      {/* Fuel Saved */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center space-x-3 shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Fuel className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Diesel Fuel Avoided</span>
          <span className="text-lg font-black text-cyan-400 font-mono tracking-tight">
            {metrics.total_diesel_saved_liters} <span className="text-xs font-normal text-slate-400">Liters</span>
          </span>
        </div>
      </div>

      {/* Expenditure Saved */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center space-x-3 shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
          <IndianRupee className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Fuel Expenditure Saved</span>
          <span className="text-lg font-black text-yellow-400 font-mono tracking-tight">
            ₹{metrics.total_money_saved_inr}
          </span>
        </div>
      </div>

      {/* Route Distance Reduction */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex items-center space-x-3 shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">2-Opt Distance Reduction</span>
          <span className="text-lg font-black text-purple-400 font-mono tracking-tight">
            {metrics.average_route_reduction_pct}% <span className="text-xs font-normal text-slate-400">vs Naive</span>
          </span>
        </div>
      </div>
    </div>
  );
};
