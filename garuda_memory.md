# Garuda Path — Intelligent AI Smart Mobility & Adaptive Fleet Logistics

## 1. Problem Statement & Real-World Logistics Friction
In fast-growing urban and semi-urban hubs like **Mangalore (Mangaluru)**, last-mile logistics accounts for over **53% of total supply chain costs**. Operations suffer from critical real-world failure modes:
- **Disjointed Multi-Stop Routing**: Static systems cause criss-crossing and 30%+ excess mileage.
- **Lack of Turn-by-Turn In-Flight Guidance**: Drivers miss turns, losing 15–20 minutes per stop.
- **First-Attempt Delivery Failure**: 20%–49% failure rates (especially COD), costing ~₹1,500 per failed attempt.
- **Address Ambiguity (The 45% Problem)**: Descriptive landmark addresses waste driver search time.
- **Single-Artery Bridge Chokepoints**: Kulur NH66 Bridge creates 45–75 minute bottlenecks.
- **Coastal Monsoon Flash Flooding**: Padil Underpass, Kottara Chowki flood under 300+ mm water.
- **No Customer Visibility**: Customers have zero live tracking, no delivery proof, no self-service options.
- **No Delivery Closure Loop**: No OTP verification, no photo proof, no feedback mechanism.
- **COD Cash Handling Risk**: Drivers carry physical cash with theft risk and reconciliation errors.
- **Zero ESG/Sustainability Metrics**: EV fleet's environmental impact is never quantified or displayed.

---

## 2. Continuous Multi-Stop Optimization Engine ("Connect in One Go")
- Hamiltonian Path with 2-Opt Local Search minimizes total tour distance.
- Single continuous polyline: Depot → Stop 1 → Stop 2 → Stop 3 → Stop 4.
- **25%–35% distance reduction** vs manual sequencing.

---

## 3. Real-Time Turn-by-Turn Navigation & Driver Telemetry
- **Maneuver Banner**: *"In 250 meters, turn right onto K.S. Rao Road"*.
- **Distance Countdown**: 450m → 250m → 50m → Turn Now!
- **Maneuver Icons**: turn-left, turn-right, roundabout, keep-straight, destination-arrival.
- **Interactive Simulation**: "Simulate Driver Run" for judges/dispatchers.

---

## 4. Multi-Class Fleet Allotment Matrix

| Vehicle Class | Model | Payload | Volume | Range | Min Width | Cost/KM | Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Class 1: Cargo E-Bike (2W)** | Zypp / Hero Nyx | **100 kg** | **0.25 m³** | **70 km** | **1.2 m** | ₹3.50 | P1 medical, narrow alleys, split-offload |
| **Class 2: EV 3W (L5N)** | Mahindra Treo Zor | **550 kg** | **3.40 m³** | **80 km** | **2.2 m** | ₹6.80 | Retail parcels, residential corridors |
| **Class 3: Heavy EV 3W (L5N)** | Euler HiLoad | **688 kg** | **4.20 m³** | **115 km** | **2.4 m** | ₹7.20 | Heavy retail, steep hills (liquid-cooled) |
| **Class 4: EV LCV (4W)** | Tata Ace EV | **600–1000 kg** | **5.90 m³** | **90 km** | **3.5 m** | ₹11.50 | B2B wholesale, port consolidation |

---

## 5. Real-World Failure Scenarios & Solutions

### Scenario 1: Narrow Alley Gridlock (Car Street / Bunder)
- **Problem**: 4W van enters 2.1m alley, gets stuck.
- **Solution**: Road geometry filter flags `width < vehicle.min_width`; auto-allots Cargo E-Bikes or assigns a curbside transshipment node.

### Scenario 2: Kulur NH66 Bridge Gridlock
- **Problem**: Container breakdown on bridge causes 50-min delay.
- **Solution**: Gemini AI detects speed drop (<6 km/h for >10 mins); reroutes via Baikampady–Kavoor inland bypass (+4.2 km, -34 mins delay).

### Scenario 3: Padil Underpass Monsoon Flood
- **Problem**: 350 mm standing water threatens EV battery immersion.
- **Solution**: Sets infinite impedance on flooded edge; reroutes along Highland Ridge Arterial (Pumpwell–Kankanady–Falnir); verifies battery SoC can sustain gradient climb.

### Scenario 4: Address Ambiguity (AACS < 0.70)
- **Problem**: Customer address is descriptive landmark (*"Behind temple, 2nd cross"*).
- **Solution**: Address engine computes confidence score; triggers customer GPS ping via SMS; if unresolved within 15 mins, redirects to nearest partner Kirana micro-locker.

### Scenario 5: EV Battery Depletion (<15% SoC)
- **Problem**: Van drops to 14% SoC on Kadri Hills with 7 remaining stops.
- **Solution**: Freezes van route; routes to charging depot; splits 7 remaining stops to two active Express E-Bikes; maps 3-minute curbside cross-dock handoff.

### Scenario 6: Emergency Medical Insertion (Kankanady Hospital)
- **Problem**: P1 urgent dialysis kit needed while vehicles are mid-trip.
- **Solution**: Marginal insertion cost ΔC identifies closest vehicle with capacity; re-sequences ahead of standard deliveries; guarantees <25 min delivery.

### Scenario 7: Customer Unreachable at Door (NEW)
- **Problem**: Driver waits 15 mins outside closed gate calling unresponsive customer, wrecking downstream ETAs.
- **Solution**: Within 50m geofence, driver taps "Customer Unreachable" → automated WhatsApp/IVR alert → visible 180-second countdown timer → if timer expires, auto-marks "Attempt 1 Failed" with GPS proof → auto-reroutes to nearest Kirana micro-locker fallback → re-sequences driver to next stop without penalty.

### Scenario 8: Mid-Route Customer Location Change (NEW)
- **Problem**: Customer answers phone: *"I left home, deliver to my shop 2 km away"*.
- **Solution**: Driver inputs new drop point; engine calculates marginal cost ΔC on the fly. If ΔC < threshold, route dynamically updates; otherwise, routes to nearest Kirana partner locker.

### Scenario 9: 4th-Floor Walk-Up Heavy Crate (NEW)
- **Problem**: E-Bike driver assigned 25kg water crates to a 4th-floor apartment with no elevator.
- **Solution**: Stop metadata includes building_floors + elevator_status. Engine adds dwell time buffer for walk-ups and considers reassigning heavy packages to vehicles already near ground-floor drop zones.

### Scenario 10: Apartment Security Guard Blocks Entry (NEW)
- **Problem**: Guard denies delivery vehicle entry, forcing 300m walk with heavy packages.
- **Solution**: System logs "Gate Restricted Delivery Point", marks walking radius penalty, auto-sends pre-arrival visitor pass OTP to guard intercom.

### Scenario 11: EV Thermal Throttling on Humid Coastal Hills (NEW)
- **Problem**: Air-cooled 2W/3W batteries throttle on steep Kadri/Derebail climbs at 36°C, cutting range 25%.
- **Solution**: Prioritizes liquid-cooled Euler HiLoad (Class 3) for steep topography routes; applies thermal degradation factor in SoC depletion model.

### Scenario 12: Monsoon Touchscreen & Barcode Failure (NEW)
- **Problem**: Heavy rain causes phantom touches; paper label barcodes get smudged.
- **Solution**: Hardware volume-button triggers for confirming delivery actions; manual 4-digit short-code fallback for smeared barcodes.

---

## 6. Customer-Facing Features & Solutions

### 6a. Live Tracking Link (Zero-Install PWA)
- **Problem**: Customers want real-time visibility without installing an app.
- **Solution**: SMS/WhatsApp branded tracking link opening a lightweight PWA showing: animated live vehicle icon, driver name & vehicle type, dynamic ETA countdown (*"Rajesh is 3 stops away on Tata Ace EV — ETA 12 mins"*), and delivery status timeline.

### 6b. Electronic Proof of Delivery (ePOD)
- **Problem**: No verified delivery handshake exists.
- **Solution**: Multi-modal ePOD system:
  - **Secure 4-Digit OTP**: Generated on customer phone, required before driver can mark "Complete" (for high-value / COD orders).
  - **Contactless Photo Proof**: Driver snaps doorstep photo → Gemini Vision API validates (*"Package intact, left in shaded porch, house #402 visible"*) → photo instantly appears on customer's tracking page.

### 6c. Self-Service Delivery Customization
- **Problem**: Customers can't alter delivery instructions in real-time.
- **Solution**: Recipient portal with 1-click actions:
  - *"Leave at Door / Guard"* (triggers contactless mode).
  - *"Leave with Neighbor"* (prompts neighbor name & house number).
  - *"Redirect to Nearest Kirana Locker"*.
  - *"Reschedule to Tomorrow Morning/Afternoon"*.

### 6d. Post-Delivery Feedback & Rating
- **Problem**: No quality tracking or driver accountability.
- **Solution**: Immediate 5-star rating with quick-tag pills (*"Handled with care"*, *"Polite"*, *"Smooth EV ride"*) and optional UPI tip for the driver.

---

## 7. Driver-Facing Features & Solutions

### 7a. Dynamic UPI QR for COD Payments
- **Problem**: 40%+ Indian deliveries are COD; drivers carry physical cash with theft risk.
- **Solution**: Driver app generates a dynamic order-specific UPI QR code. Customer scans via PhonePe/GPay/Paytm → payment instantly verified → COD reconciled without cash handling.

### 7b. Crowdsourced Micro-Road Geometry Reporting
- **Problem**: Maps don't know about temple festival barricades, new one-way streets, or low overhead cables.
- **Solution**: Quick 1-tap driver report: *"Road Blocked / One-Way / Overhead Obstruction"* → immediately updates central engine impedance map for all fleet drivers.

### 7c. Emergency SOS & Vehicle Distress Beacon
- **Problem**: Driver has no quick way to report a breakdown, puncture, or accident.
- **Solution**: 1-tap SOS button → sends GPS location + battery status + incident type to fleet manager dashboard → triggers nearest-available vehicle rescue dispatch.

### 7d. Offline-First Resilience
- **Problem**: Coastal rain, tunnels, and basements kill 4G/GPS.
- **Solution**: Offline PWA caching of vector tiles and stop manifests. Offline OTP verification, local photo timestamps via IndexedDB/SQLite, auto-sync when signal returns.

---

## 8. Dispatcher & ESG Dashboard Features & Solutions

### 8a. Live ESG Green Mobility Carbon Counter
- **Problem**: All-EV fleet but environmental win is invisible to judges/stakeholders.
- **Solution**: Dynamic dashboard ticker:
  - `kg CO₂ Saved = km_driven × (160g_diesel - 45g_EV_grid)`
  - `Liters Diesel Avoided = km_driven ÷ 12 km/L`
  - `₹ Cost Saved = km_driven × (₹9_diesel/km - ₹1.10_EV/km)`

### 8b. Predictive SLA Breach Early Warning
- **Problem**: Dashboards only alert after a delay has occurred.
- **Solution**: AI regression model predicts breach 30–45 mins ahead based on driver velocity, weather trends, and stop dwell time. Color-coded alerts: Green → Yellow → Pulsing Red for preemptive intervention.

### 8c. Gemini Dispatcher Copilot Chat
- **Problem**: Gemini predicts disruptions but dispatcher can't converse or command.
- **Solution**: Embedded chat panel for natural language fleet commands:
  - *"Why was Euler HiLoad chosen over Tata Ace for Stop #5?"* → Gemini explains citing 688kg payload and 2.4m alley width.
  - *"Redistribute Ace EV's remaining stops to the two Treo Zors due to low battery"* → Solver executes.

### 8d. Cost-Per-Delivery Financial Analytics
- **Problem**: No granular financial visibility for fleet managers.
- **Solution**: Real-time cost calculator comparing:
  - Cost per successful delivery vs. ₹1,500 failed delivery penalty.
  - Electricity cost vs. ICE petrol savings (₹/km).
  - Empty deadhead / return mileage cost tracking.

---

## 9. Hackathon Demo Video Script (3–5 Minutes)
- **0:00 – 0:45 (Problem Hook)**: ₹1,500 failed delivery cost, 45% address ambiguity, static route loops.
- **0:45 – 1:30 (Multi-Stop Route + Map)**: 4 stops connected in one shortest continuous path with 2-Opt.
- **1:30 – 2:00 (Driver Navigation)**: Simulated driver travel with meter countdowns and stop arrivals.
- **2:00 – 2:30 (ePOD & Customer Tracking)**: OTP delivery verification + live customer tracking link preview.
- **2:30 – 3:15 (Live AI Rerouting)**: NH66 bridge jam → Gemini AI explains inland detour → driver nav updates live.
- **3:15 – 3:45 (ESG Carbon Counter & Metrics)**: Live CO₂ saved ticker, fuel savings, 34% time saved.
- **3:45 – 4:00 (Conclusion)**: Clean zero-emission fleet impact and commercial scalability.
