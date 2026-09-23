import React, { useState } from 'react';
import { DispatcherHeader } from '../components/dashboard/DispatcherHeader';
import { EsgCarbonTicker } from '../components/dashboard/EsgCarbonTicker';
import { ScenarioSimulatorToolbar } from '../components/dashboard/ScenarioSimulatorToolbar';
import { FleetDrawer } from '../components/dashboard/FleetDrawer';
import { OrderQueuePanel } from '../components/dashboard/OrderQueuePanel';
import { MapboxCanvas } from '../components/map/MapboxCanvas';
import { GeminiAdvisorModal } from '../components/dashboard/GeminiAdvisorModal';

export const Dashboard: React.FC = () => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0F19]">
      {/* Top Navigation Bar */}
      <DispatcherHeader />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
        {/* Top Ticker: Live ESG Green Mobility Counters */}
        <EsgCarbonTicker />

        {/* Disaster & Incident Simulation Toolbar */}
        <ScenarioSimulatorToolbar onOpenAiModal={() => setIsAiModalOpen(true)} />

        {/* 3-Column Command Center Workspace */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          {/* Left Column: Fleet Telemetry & Battery Drawer (3 cols) */}
          <div className="col-span-12 md:col-span-3 h-full min-h-0">
            <FleetDrawer />
          </div>

          {/* Center Column: Interactive Mapbox GL Mangalore Canvas (6 cols) */}
          <div className="col-span-12 md:col-span-6 h-full min-h-0">
            <MapboxCanvas />
          </div>

          {/* Right Column: Order Ingestion & Stop Sequence Manifest (3 cols) */}
          <div className="col-span-12 md:col-span-3 h-full min-h-0">
            <OrderQueuePanel />
          </div>
        </div>
      </div>

      {/* Gemini AI Disruption Advisor & Dispatcher Copilot Dialog */}
      <GeminiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
