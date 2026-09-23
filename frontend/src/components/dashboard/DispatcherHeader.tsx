import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from '../../context/DispatchContext';
import { Zap, RefreshCw, ShieldCheck, UserCheck, LogOut, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DispatcherHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOptimizing, triggerOptimization, metrics } = useDispatch();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => setTimeStr(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 px-6 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between z-30">
      {/* Brand & City Grid */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
            🦅
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              GARUDA <span className="text-cyan-400">PATH</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>MANGALORE MOBILITY ENGINE</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">Hub: Hampankatta • Grid Active</span>
        </div>
      </div>

      {/* Operational Status Badges */}
      <div className="flex items-center space-x-4">
        {/* Real-time Clock */}
        <div className="hidden md:block font-mono text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          IST {timeStr}
        </div>

        {/* P1 SLA Adherence Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-3 py-1 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>P1 SLA: {metrics.p1_urgent_sla_adherence_pct}%</span>
        </div>

        {/* Re-Optimize Button */}
        <button
          onClick={triggerOptimization}
          disabled={isOptimizing}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : '2-Opt Re-Optimize'}</span>
        </button>

        {/* Link to Driver View */}
        <Link
          to="/driver"
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-all"
        >
          📱 Driver View
        </Link>

        {/* User Pill */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-200 font-medium">{user?.full_name || 'Dispatcher'}</span>
          <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors ml-1">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
