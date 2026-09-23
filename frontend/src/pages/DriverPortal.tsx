import React, { useState, useEffect } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { TurnByTurnBanner } from '../components/driver/TurnByTurnBanner';
import { DynamicUpiQrModal } from '../components/driver/DynamicUpiQrModal';
import { EpodVerificationModal } from '../components/driver/EpodVerificationModal';
import { MapboxCanvas } from '../components/map/MapboxCanvas';
import { Order, OptimizedStop } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ShieldCheck, 
  PhoneCall, 
  Radio,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DriverPortal: React.FC = () => {
  const { selectedRoute, vehicles, refreshAll } = useDispatch();
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [countdownMeters, setCountdownMeters] = useState(380);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals state
  const [selectedCodOrder, setSelectedCodOrder] = useState<Order | null>(null);
  const [selectedEpodOrder, setSelectedEpodOrder] = useState<Order | null>(null);
  const [unreachableTimer, setUnreachableTimer] = useState<number | null>(null);

  const stops = selectedRoute?.stops || [];
  const currentStop: OptimizedStop | undefined = stops[activeStopIndex];
  const nextStop: OptimizedStop | undefined = stops[activeStopIndex + 1];

  // In-flight driving simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setCountdownMeters(prev => {
          if (prev <= 40) {
            // Reached turn/stop
            if (activeStopIndex < stops.length - 1) {
              setActiveStopIndex(i => i + 1);
              return 450;
            } else {
              setIsSimulating(false);
              return 0;
            }
          }
          return prev - 30;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, activeStopIndex, stops.length]);

  // Unreachable customer 180s countdown protocol
  useEffect(() => {
    let timer: any = null;
    if (unreachableTimer !== null && unreachableTimer > 0) {
      timer = setInterval(() => {
        setUnreachableTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [unreachableTimer]);

  const handleStartUnreachableProtocol = () => {
    setUnreachableTimer(180);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col p-4 max-w-2xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400">
          <ArrowLeft className="w-4 h-4" />
          <span>Dispatcher Cockpit</span>
        </Link>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200">
            {selectedRoute?.vehicle.name || 'Garuda Driver Copilot'}
          </span>
        </div>
      </div>

      {/* Turn-by-Turn Navigation HUD */}
      <TurnByTurnBanner
        currentStep={currentStop?.navigation_steps[0]}
        nextStep={currentStop?.navigation_steps[1]}
        destinationName={currentStop?.order.customer_name || 'Central Hampankatta Depot'}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        countdownMeters={countdownMeters}
      />

      {/* Driver Map View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden h-[300px] mb-4">
        <MapboxCanvas />
      </div>

      {/* Unreachable Customer 180s Alert Banner */}
      {unreachableTimer !== null && (
        <div className="bg-yellow-950/50 border border-yellow-800/80 p-3.5 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Timer className="w-5 h-5 text-yellow-400 animate-spin" />
            <div>
              <h4 className="text-xs font-bold text-yellow-300">Customer Unreachable Protocol Active</h4>
              <p className="text-[11px] text-yellow-400/80">
                Automated IVR/WhatsApp ping sent. Auto-rerouting to nearest Kirana locker in{' '}
                <strong className="font-mono text-white text-xs">{unreachableTimer}s</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUnreachableTimer(null)}
            className="text-[10px] text-slate-400 hover:text-white underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Active Stop Detail Card */}
      {currentStop && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-1 rounded-lg">
              STOP #{activeStopIndex + 1} OF {stops.length}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentStop.order.priority === 'P1_URGENT' 
                ? 'bg-red-950 text-red-400 border border-red-800' 
                : 'bg-slate-800 text-slate-300'
            }`}>
              {currentStop.order.priority.replace('_', ' ')}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{currentStop.order.customer_name}</h3>
            <p className="text-xs text-slate-300 flex items-center space-x-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{currentStop.order.delivery_address}</span>
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400 font-mono">
              <span>Sector: {currentStop.order.destination_sector}</span>
              <span>•</span>
              <span>Weight: {currentStop.order.weight_kg} kg</span>
              <span>•</span>
              <span>ETA: {currentStop.estimated_arrival_time}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {/* Dynamic UPI Payment Button if COD */}
            {currentStop.order.payment_mode === 'COD_CASH_ON_DELIVERY' && (
              <button
                onClick={() => setSelectedCodOrder(currentStop.order)}
                className="py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/20"
              >
                <QrCode className="w-4 h-4" />
                <span>Collect UPI ₹{currentStop.order.cod_amount_inr || 1450}</span>
              </button>
            )}

            {/* Electronic Proof of Delivery (ePOD) */}
            <button
              onClick={() => setSelectedEpodOrder(currentStop.order)}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Doorstep ePOD</span>
            </button>

            {/* Unreachable Protocol Trigger */}
            <button
              onClick={handleStartUnreachableProtocol}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 border border-slate-700"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Customer Unreachable</span>
            </button>
          </div>
        </div>
      )}

      {/* Full Tour Sequence */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <h4 className="font-bold text-xs text-slate-300 mb-3">Today's Hamiltonian Tour Stops</h4>
        <div className="space-y-2">
          {stops.map((stop, idx) => (
            <div
              key={stop.order.id}
              onClick={() => setActiveStopIndex(idx)}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                idx === activeStopIndex
                  ? 'bg-slate-800 border-cyan-500 text-white font-bold'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{stop.order.customer_name}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="font-mono text-[10px] text-cyan-400">+{stop.distance_from_prev_km}km</span>
                {stop.order.status === 'delivered' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">{stop.estimated_arrival_time}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic UPI Modal */}
      <DynamicUpiQrModal
        order={selectedCodOrder}
        isOpen={selectedCodOrder !== null}
        onClose={() => setSelectedCodOrder(null)}
        onPaymentSuccess={() => {
          refreshAll();
        }}
      />

      {/* ePOD Modal */}
      <EpodVerificationModal
        order={selectedEpodOrder}
        isOpen={selectedEpodOrder !== null}
        onClose={() => setSelectedEpodOrder(null)}
        onSuccess={() => {
          refreshAll();
        }}
      />
    </div>
  );
};
