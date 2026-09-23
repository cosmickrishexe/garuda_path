const fs = require('fs');

// 1. ai.controller.ts
let aiControllerPath = 'backend/src/controllers/ai.controller.ts';
let aiContent = fs.readFileSync(aiControllerPath, 'utf8');
aiContent = aiContent.replace(
  'Active In-Transit Orders: ${activeOrders.length}',
  'Active In-Transit Orders: ${activeOrders.length} - ${activeOrders.map(o => `${o.customer_name} (${o.priority}) to ${o.destination_sector}`).join(\', \')}'
);
fs.writeFileSync(aiControllerPath, aiContent);

// 2. DriverPortal.tsx
let driverPortalPath = 'frontend/src/pages/DriverPortal.tsx';
let driverContent = fs.readFileSync(driverPortalPath, 'utf8');
if (!driverContent.includes('MapboxCanvas')) {
  driverContent = driverContent.replace(
    'import { EpodVerificationModal } from \'../components/driver/EpodVerificationModal\';',
    'import { EpodVerificationModal } from \'../components/driver/EpodVerificationModal\';\nimport { MapboxCanvas } from \'../components/map/MapboxCanvas\';'
  );
  const targetUi = `      <TurnByTurnBanner
        currentStep={currentStop?.navigation_steps[0]}
        nextStep={currentStop?.navigation_steps[1]}
        destinationName={currentStop?.order.customer_name || 'Central Hampankatta Depot'}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        countdownMeters={countdownMeters}
      />`;
  const replacementUi = targetUi + `\n\n      {/* Driver Map View */}\n      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden h-[300px] mb-4">\n        <MapboxCanvas />\n      </div>`;
  driverContent = driverContent.replace(targetUi, replacementUi);
  fs.writeFileSync(driverPortalPath, driverContent);
}

// 3. MapboxCanvas.tsx simulation
let mapboxPath = 'frontend/src/components/map/MapboxCanvas.tsx';
let mapboxContent = fs.readFileSync(mapboxPath, 'utf8');
if (!mapboxContent.includes('animatedVehicles')) {
  mapboxContent = mapboxContent.replace(
    '  const [useFallbackMap, setUseFallbackMap] = useState(false);',
    '  const [useFallbackMap, setUseFallbackMap] = useState(false);\n  const [animatedVehicles, setAnimatedVehicles] = useState(vehicles);\n\n  useEffect(() => {\n    setAnimatedVehicles(vehicles);\n  }, [vehicles]);\n\n  useEffect(() => {\n    if (!activeSimulationRunning) return;\n    const interval = setInterval(() => {\n      setAnimatedVehicles(prev => prev.map(v => {\n        // Small random movement along lat/lng to simulate driving\n        return {\n          ...v,\n          current_lat: v.current_lat + (Math.random() - 0.5) * 0.0005,\n          current_lng: v.current_lng + (Math.random() - 0.5) * 0.0005\n        };\n      }));\n    }, 1000);\n    return () => clearInterval(interval);\n  }, [activeSimulationRunning]);'
  );
  
  // Replace references to `vehicles.map` in SVG rendering with `animatedVehicles.map`
  mapboxContent = mapboxContent.replace(
    '{/* Active Vehicle Fleet Markers */}\n            {vehicles.map(v => {',
    '{/* Active Vehicle Fleet Markers */}\n            {animatedVehicles.map(v => {'
  );
  fs.writeFileSync(mapboxPath, mapboxContent);
}

console.log("Update completed!");
