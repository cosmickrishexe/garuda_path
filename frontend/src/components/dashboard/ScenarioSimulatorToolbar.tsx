import React, { useState } from 'react';
import { useDispatch } from '../../context/DispatchContext';
import { AlertTriangle, Droplets, Zap, BatteryLow, MessageSquareText, ShieldAlert } from 'lucide-react';

interface Props {
  onOpenAiModal: () => void;
}

export const ScenarioSimulatorToolbar: React.FC<Props> = ({ onOpenAiModal }) => {
  const { simulateScenario } = useDispatch();
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);

  const handleTrigger = async (type: string) => {
    setActiveTrigger(type);
    try {
      await simulateScenario(type);
    } finally {
      setTimeout(() => setActiveTrigger(null), 1200);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 pr-2 border-r border-slate-800">
        <ShieldAlert className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline">DISASTER & EXCEPTION SIMULATOR:</span>
      </div>

      {/* NH66 Bridge Jam */}
      <button
        onClick={() => handleTrigger('NH66_BRIDGE_JAM')}
        disabled={activeTrigger !== null}
        className="flex items-center space-x-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        <span>Kulur NH66 Jam</span>
      </button>

      {/* Padil Monsoon Flood */}
      <button
        onClick={() => handleTrigger('PADIL_FLOOD')}
        disabled={activeTrigger !== null}
        className="flex items-center space-x-1.5 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      >
        <Droplets className="w-3.5 h-3.5 text-blue-400" />
        <span>Padil Monsoon Flood</span>
      </button>

      {/* P1 Emergency Medical Injection */}
      <button
        onClick={() => handleTrigger('P1_EMERGENCY_MEDICAL')}
        disabled={activeTrigger !== null}
        className="flex items-center space-x-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      >
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>P1 Hospital Insertion</span>
      </button>

      {/* Ask Gemini AI Copilot */}
      <button
        onClick={onOpenAiModal}
        className="ml-auto flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
      >
        <MessageSquareText className="w-3.5 h-3.5" />
        <span>Gemini Dispatch Copilot</span>
      </button>
    </div>
  );
};
