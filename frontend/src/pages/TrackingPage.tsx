import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const data = await api.getPublicTracking(trackingCode || 'GAR-MNG-1001');
        setTrackingData(data);
      } catch (err) {
        console.error('Tracking fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [trackingCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm animate-pulse">
          <Truck className="w-5 h-5 animate-bounce" />
          <span>Locating delivery vehicle across Mangalore grid...</span>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold">Tracking Order Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">Please verify your tracking code.</p>
        <Link to="/dashboard" className="mt-4 text-xs text-cyan-400 underline">
          Return to Dispatcher Cockpit
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 max-w-lg mx-auto flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm">
              🦅
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">GARUDA PATH</h2>
              <span className="text-[10px] text-slate-400 font-mono">Live Courier Tracking</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            #{trackingData.tracking_code}
          </span>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mt-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                {trackingData.status.replace('_', ' ')}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {trackingData.status === 'delivered' ? 'Package Delivered Successfully' : 'Courier Approaching Your Neighborhood'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stop #{trackingData.stop_sequence || 1} on today's route
              </p>
            </div>
          </div>

          {/* Vehicle Telemetry */}
          {trackingData.vehicle && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Clean EV Transport</span>
                <span className="font-bold text-slate-200">{trackingData.vehicle.name}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Plate Registration</span>
                <span className="font-bold text-cyan-400">{trackingData.vehicle.plate_number}</span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Details */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mt-3 space-y-2 text-xs">
          <div className="flex items-start space-x-2 text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-medium block">{trackingData.customer_name}</span>
              <span className="text-slate-400 text-[11px]">{trackingData.delivery_address}</span>
            </div>
          </div>
        </div>

        {/* Self-Service Options */}
        <div className="mt-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-300 mb-2">Delivery Instructions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl text-[11px] font-medium text-slate-300 transition-all text-center">
              🚪 Leave at Guard/Door
            </button>
            <button className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl text-[11px] font-medium text-slate-300 transition-all text-center">
              👥 Leave with Neighbor
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 text-center text-[10px] text-slate-500 font-mono">
        Garuda Path Zero-Emission Logistics Engine • Mangalore
      </div>
    </div>
  );
};
