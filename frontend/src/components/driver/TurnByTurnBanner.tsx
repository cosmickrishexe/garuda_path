import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowUpRight, ArrowUpLeft, RotateCw, MapPin, Play, Pause, Navigation } from 'lucide-react';
import { NavigationStep } from '../../types';

interface Props {
  currentStep?: NavigationStep;
  nextStep?: NavigationStep;
  destinationName: string;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  countdownMeters: number;
}

export const TurnByTurnBanner: React.FC<Props> = ({
  currentStep,
  nextStep,
  destinationName,
  isSimulating,
  onToggleSimulation,
  countdownMeters
}) => {
  const getManeuverIcon = (type?: string) => {
    switch (type) {
      case 'turn-right':
        return <ArrowUpRight className="w-8 h-8 text-cyan-400" />;
      case 'turn-left':
        return <ArrowUpLeft className="w-8 h-8 text-cyan-400" />;
      case 'roundabout':
        return <RotateCw className="w-8 h-8 text-yellow-400" />;
      case 'destination-arrival':
        return <MapPin className="w-8 h-8 text-emerald-400" />;
      default:
        return <ArrowUp className="w-8 h-8 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        {/* Main Current Maneuver */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
            {getManeuverIcon(currentStep?.maneuver_type)}
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black font-mono text-cyan-400 tracking-tight">
                {countdownMeters > 0 ? `${countdownMeters}m` : 'Turn Now!'}
              </span>
              <span className="text-xs text-slate-400 font-medium">to next turn</span>
            </div>
            <h2 className="text-sm font-bold text-white mt-0.5">
              {currentStep?.instruction || 'Continue straight along corridor'}
            </h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Target: <strong className="text-slate-200">{destinationName}</strong>
            </p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Drive</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate In-Flight Run</span>
              </>
            )}
          </button>

          {nextStep && (
            <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <span>Then:</span>
              <span className="text-slate-200">{nextStep.instruction.slice(0, 30)}...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
