import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useDispatch } from '../../context/DispatchContext';
import { Navigation, AlertTriangle, Battery, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
const MANGALORE_CENTER: [number, number] = [74.8426, 12.8698]; // [lng, lat]

export const MapboxCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallbackMap, setUseFallbackMap] = useState(false);

  const { 
    vehicles, 
    orders, 
    routePlans, 
    incidents, 
    selectedVehicleId, 
    setSelectedVehicleId,
    selectedRoute,
    activeSimulationRunning 
  } = useDispatch();

  const [animatedVehicles, setAnimatedVehicles] = useState(vehicles);

  useEffect(() => {
    setAnimatedVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    if (!activeSimulationRunning) return;
    const interval = setInterval(() => {
      setAnimatedVehicles(prev => prev.map(v => {
        // Small random movement along lat/lng to simulate driving
        return {
          ...v,
          current_lat: v.current_lat + (Math.random() - 0.5) * 0.0005,
          current_lng: v.current_lng + (Math.random() - 0.5) * 0.0005
        };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSimulationRunning]);

  // Try initializing Mapbox GL JS
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('example_public_token')) {
      // Use zero-config high-fidelity SVG fallback map
      setUseFallbackMap(true);
      return;
    }

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: MANGALORE_CENTER,
        zoom: 12.2,
        pitch: 35
      });

      map.on('load', () => {
        setMapLoaded(true);
        mapRef.current = map;
      });

      map.on('error', () => {
        console.warn('Mapbox GL token error. Switching to zero-config vector canvas.');
        setUseFallbackMap(true);
      });

      return () => {
        map.remove();
      };
    } catch (e) {
      setUseFallbackMap(true);
    }
  }, []);

  // Update Route Polylines in Mapbox GL
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || useFallbackMap) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Route GeoJSON Layers
    routePlans.forEach((plan, idx) => {
      const sourceId = `route-source-${plan.vehicle.id}`;
      const layerId = `route-layer-${plan.vehicle.id}`;

      const colorMap: Record<string, string> = {
        CARGO_EBIKE_2W: '#06B6D4',
        TREO_ZOR_3W: '#10B981',
        EULER_HILOAD_3W: '#F59E0B',
        TATA_ACE_4W: '#A855F7'
      };
      const routeColor = colorMap[plan.vehicle.vehicle_class] || '#3B82F6';

      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: plan.route_polyline_coordinates
        }
      };

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: geojson });
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': routeColor,
            'line-width': plan.vehicle.id === selectedVehicleId ? 5 : 2.5,
            'line-opacity': plan.vehicle.id === selectedVehicleId ? 0.95 : 0.45
          }
        });
      }
    });

    // Add Vehicle Markers
    vehicles.forEach(vehicle => {
      const el = document.createElement('div');
      el.className = `cursor-pointer flex items-center justify-center p-2 rounded-full shadow-xl transition-all duration-300 ${
        vehicle.id === selectedVehicleId ? 'ring-4 ring-cyan-400 scale-125 bg-cyan-600' : 'bg-slate-800'
      }`;
      el.innerHTML = `
        <div class="relative flex items-center justify-center text-white text-xs font-bold">
          🚗
          <span class="absolute -top-6 bg-slate-900/90 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
            ${vehicle.plate_number.slice(-4)} (${vehicle.battery_pct}%)
          </span>
        </div>
      `;
      el.addEventListener('click', () => setSelectedVehicleId(vehicle.id));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([vehicle.current_lng, vehicle.current_lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add Incident Markers
    incidents.filter(i => i.is_active).forEach(incident => {
      const el = document.createElement('div');
      el.className = 'animate-bounce cursor-pointer p-1.5 bg-red-600 rounded-full border-2 border-white shadow-lg text-white text-xs';
      el.innerHTML = `⚠️`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.lng, incident.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2 text-slate-900">
            <h4 class="font-bold text-red-600">${incident.title}</h4>
            <p class="text-xs">${incident.location_name}</p>
            <p class="text-[11px] text-slate-600 mt-1">${incident.description || ''}</p>
          </div>
        `))
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, routePlans, vehicles, incidents, selectedVehicleId, useFallbackMap]);

  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
      {/* Real Mapbox Container */}
      {!useFallbackMap ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        /* High-Fidelity Zero-Config Interactive Mangalore Vector Canvas */
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#090D16] to-[#0F172A] p-4">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mangalore Logistics Grid Engine • Hampankatta Depot [12.8698°N, 74.8426°E]</span>
          </div>

          <svg 
            viewBox="74.78 12.84 0.25 0.18" 
            className="w-full h-full max-h-[85vh] filter drop-shadow-2xl select-none"
            style={{ transform: 'scaleY(-1)' }} // Invert latitude to match standard SVG Cartesian
          >
            {/* Arabian Sea Coastal Shoreline */}
            <path
              d="M 74.79 12.84 L 74.80 12.92 L 74.81 12.96 L 74.79 13.02 L 74.78 13.02 L 74.78 12.84 Z"
              fill="#08182B"
              stroke="#0E325A"
              strokeWidth="0.001"
            />
            {/* Gurupura River Flowing to Panambur / Kulur */}
            <path
              d="M 74.88 12.94 Q 74.85 12.93 74.82 12.93 Q 74.805 12.92 74.80 12.90"
              fill="none"
              stroke="#133863"
              strokeWidth="0.004"
              strokeLinecap="round"
            />

            {/* NH66 National Highway Arterial Corridor */}
            <path
              d="M 74.794 13.011 L 74.809 12.945 L 74.8235 12.9285 L 74.851 12.885 L 74.8625 12.859 L 74.881 12.868"
              fill="none"
              stroke="#1E293B"
              strokeWidth="0.0035"
              strokeDasharray="0.004 0.002"
            />

            {/* Continuous Multi-Stop Route Polylines */}
            {routePlans.map((plan) => {
              const colorMap: Record<string, string> = {
                CARGO_EBIKE_2W: '#06B6D4',
                TREO_ZOR_3W: '#10B981',
                EULER_HILOAD_3W: '#F59E0B',
                TATA_ACE_4W: '#A855F7'
              };
              const color = colorMap[plan.vehicle.vehicle_class] || '#3B82F6';
              const isSelected = plan.vehicle.id === selectedVehicleId;
              const pointsStr = plan.route_polyline_coordinates.map(p => `${p[0]},${p[1]}`).join(' ');

              return (
                <polyline
                  key={plan.vehicle.id}
                  points={pointsStr}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? 0.0028 : 0.0015}
                  strokeOpacity={isSelected ? 0.95 : 0.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Delivery Stops Pins */}
            {orders.map((order) => {
              const isP1 = order.priority === 'P1_URGENT';
              const isP2 = order.priority === 'P2_EXPRESS';
              const pinColor = isP1 ? '#EF4444' : isP2 ? '#F59E0B' : '#3B82F6';

              return (
                <g key={order.id} className="cursor-pointer">
                  {isP1 && (
                    <circle
                      cx={order.lng}
                      cy={order.lat}
                      r="0.0045"
                      fill="#EF4444"
                      fillOpacity="0.3"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={order.lng}
                    cy={order.lat}
                    r={isP1 ? 0.0028 : 0.002}
                    fill={pinColor}
                    stroke="#FFFFFF"
                    strokeWidth="0.0006"
                  />
                </g>
              );
            })}

            {/* Active Incidents */}
            {incidents.filter(i => i.is_active).map(inc => (
              <g key={inc.id}>
                <circle
                  cx={inc.lng}
                  cy={inc.lat}
                  r="0.006"
                  fill="#DC2626"
                  fillOpacity="0.4"
                  className="animate-pulse"
                />
                <circle
                  cx={inc.lng}
                  cy={inc.lat}
                  r="0.0025"
                  fill="#DC2626"
                  stroke="#FFFFFF"
                  strokeWidth="0.0008"
                />
              </g>
            ))}

            {/* Active Vehicle Fleet Markers */}
            {animatedVehicles.map(v => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <g 
                  key={v.id} 
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setSelectedVehicleId(v.id)}
                >
                  {isSelected && (
                    <circle
                      cx={v.current_lng}
                      cy={v.current_lat}
                      r="0.006"
                      fill="#06B6D4"
                      fillOpacity="0.4"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    cx={v.current_lng}
                    cy={v.current_lat}
                    r={isSelected ? 0.004 : 0.003}
                    fill={isSelected ? '#06B6D4' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth="0.0008"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Selected Route Floating HUD */}
      {selectedRoute && (
        <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {selectedRoute.vehicle.vehicle_class === 'CARGO_EBIKE_2W' ? '2W' : selectedRoute.vehicle.vehicle_class === 'TATA_ACE_4W' ? '4W' : '3W'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{selectedRoute.vehicle.name}</h3>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {selectedRoute.vehicle.plate_number}
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Battery className="w-3 h-3" />
                  <span>{selectedRoute.remaining_battery_pct}% SoC</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Continuous Hamiltonian Tour: {selectedRoute.stops.length} stops • {selectedRoute.total_distance_km} km • ~{selectedRoute.total_duration_mins} mins
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div className="text-center">
              <span className="text-slate-400 block">Payload</span>
              <span className="font-bold text-cyan-400 text-sm">{selectedRoute.total_payload_kg} / {selectedRoute.vehicle.max_payload_kg} kg</span>
            </div>
            <div className="text-center">
              <span className="text-slate-400 block">CO₂ Avoided</span>
              <span className="font-bold text-emerald-400 text-sm">+{selectedRoute.co2_avoided_kg} kg</span>
            </div>
            <div className="text-center">
              <span className="text-slate-400 block">Fuel Saved</span>
              <span className="font-bold text-yellow-400 text-sm">{selectedRoute.fuel_saved_pct}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
