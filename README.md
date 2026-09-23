# 🦅 Garuda Path — AI for Smart Mobility & Adaptive Fleet Logistics

> **Hackathon Theme**: AI for Smart Mobility (Scenario-Based Challenge)  
> **Target Geography**: Mangalore (Mangaluru) Urban & Semi-Urban Logistics Grid  
> **Repository**: [https://github.com/cosmickrishexe/garuda_share](https://github.com/cosmickrishexe/garuda_share)

---

## 📌 1. Problem Statement
In fast-growing urban and semi-urban hubs like **Mangalore**, last-mile delivery operations account for over **53% of total logistics costs**. Logistics operators face crippling real-world inefficiencies:
- **Disjointed Multi-Stop Routes**: When a driver has 4–8 deliveries, static routing criss-crosses town, causing 30%+ excess mileage.
- **Lack of In-Flight Turn-by-Turn Guidance**: Drivers struggle with unfamiliar crossroads and descriptive landmark addresses (*"Behind temple, 2nd cross"*), losing 15–20 minutes per drop.
- **High First-Attempt Delivery Failures**: 20%–30% in standard e-commerce and up to 40%–49% in Cash-on-Delivery (COD).
- **Single-Artery Bridge Bottlenecks**: Container trailer gridlock on the Kulur NH66 Bridge across the Gurupura River stalls vehicles for 45–75 minutes.
- **Coastal Monsoon Flooding**: Flash waterlogging at Padil Railway Underpass and Kottara Chowki (>300 mm water) paralyzes routes and risks EV battery immersion cutoffs.
- **Zero Mid-Journey Adaptability**: Disconnected manual routes cannot accommodate urgent medical deliveries or live traffic spikes.

---

## 🚀 2. Solution: Garuda Path
Garuda Path is an **intelligent, reactive fleet dispatching and dynamic route optimization platform** that combines:
1. **Continuous Multi-Stop Shortest Path ("In One Go")**:
   - Computes a single, optimal Hamiltonian path connecting all assigned stops using **2-Opt Local Search Heuristic**.
   - Eliminates route loops, crossovers, and backtracking, cutting total delivery distance by **25%–35%**.
2. **Real-Time Driver Turn-by-Turn Navigation**:
   - Live maneuver banners (e.g. *"In 250 meters, turn right onto K.S. Rao Road"*).
   - Real-time dynamic distance countdown ($450\text{m} \to 250\text{m} \to 50\text{m} \to \text{Turn Now!}$).
   - Interactive simulation mode allowing dispatchers and judges to watch the vehicle progress along the route.
3. **Google Gemini AI Mobility Advisor**: Detects real-time traffic anomalies, analyzes impact, and explains rerouting decisions.
4. **Capacitated Vehicle Routing (CVRP) Engine**: Enforces dual-capacity bounds (volume $m^3$ vs weight $kg$).
5. **Dynamic Marginal Cost Insertion**: Injects urgent P1 medical packages mid-route with minimal deviation.
6. **Mapbox GL Interactive Command Center**: Live vector map rendering routes, fleet pins, traffic congestion overlays, and 1-click scenario simulation.

---

## 🚚 3. Heterogeneous 4-Class Clean EV Fleet

| Vehicle Class | Benchmark Model | Max Payload | Max Volume | Range | Min Road Width | Cost/KM | Operational Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Class 1: Cargo E-Bike (2W)** | Zypp / Hero Nyx Commercial Cargo | **100 kg** | **0.25 m³** | **70 km** | **1.2 m** | ₹3.50 | Rapid P1 medical orders, narrow alleys (Car Street), split-offload pickups. |
| **Class 2: EV 3W Cargo (L5N)** | Mahindra Treo Zor Delivery Van | **550 kg** | **3.40 m³** | **80 km** | **2.2 m** | ₹6.80 | High-density retail parcels, residential corridors (Bejai, Kadri, Mallikatta). |
| **Class 3: Heavy EV 3W (L5N)** | Euler HiLoad EV Liquid-Cooled | **688 kg** | **4.20 m³** | **115 km** | **2.4 m** | ₹7.20 | Heavy retail, beverage crates, steep coastal/hilly terrain (Kadri Hills, Derebail). |
| **Class 4: EV LCV Mini-Truck (4W)** | Tata Ace EV Box Container | **600–1,000 kg** | **5.90 m³** | **90 km** | **3.5 m** | ₹11.50 | B2B wholesale, bulky white goods, port container consolidation (Panambur Port to central hubs). |

---

## 🚨 4. Real-World Operational Scenarios Handled

1. **🚨 Kulur NH66 Bridge Gridlock**: Container breakdown causes 50-min delay; Gemini AI detects speed drop and dynamically reroutes vehicles via the **Baikampady–Kavoor inland bypass** (+4.2 km, -34 mins delay).
2. **⚡ Emergency P1 Hospital Delivery**: Urgent dialysis kit requested for **Kankanady Father Muller Hospital**; dynamic marginal insertion updates route sequence with $<25$ min delivery.
3. **🌊 Padil Underpass Monsoon Flood**: Ingress sensor reports 350 mm standing water; system sets infinite impedance and routes vehicles via the **Pumpwell–Kankanady highland ridge**.
4. **❌ Surathkal Customer Reschedule**: Mid-trip cancellation prunes stop and accelerates downstream customer ETAs by 18 minutes.
5. **📦 Car Street Narrow Alley Re-allotment**: 2.1m alley filter prevents 4W van gridlock by auto-allocating Cargo E-Bikes or curbside transshipment.
6. **🔋 Kadri Hills EV Low Battery Offload**: Van drops to 14% SoC; routes to charging depot while offloading 7 remaining stops to two active E-Bikes.

---

## 🛠️ 5. Technology Stack

- **Frontend**: React.js (v18) + Vite + React Router + Tailwind CSS + Lucide Icons + Mapbox GL JS + Axios
- **Backend**: Node.js + Express.js + JWT Authentication + bcrypt + Zod Validation
- **Database**: **Supabase PostgreSQL** (`@supabase/supabase-js`) with real-time subscriptions for live order tracking & fleet updates
- **Artificial Intelligence**: Google Gemini API (`GEMINI_API_KEY` stored exclusively in backend env)
- **Knowledge & Memory**: Graphify Knowledge Graph (`garuda_memory.md` & `graphify-out/`)

---

## 📦 6. Getting Started

### Prerequisites
- Node.js 18+ & npm
- Google Gemini API Key
- Mapbox Public Access Token (optional, built-in offline simulation mode available)

### Installation
```bash
# Clone the repository
git clone https://github.com/cosmickrishexe/garuda_share.git
cd garuda_share

# Install and start Backend
cd backend
npm install
npm run dev

# Install and start Frontend (in another terminal)
cd ../frontend
npm install
npm run dev
```

---

## 🏆 7. Hackathon Submission Information
- **Theme**: AI for Smart Mobility (Scenario-Based Challenge)
- **Problem Statement & Solution Description**: Included in repository
- **Demo Video Duration**: 3–5 Minutes (Covering problem context, multi-stop continuous routing, live turn-by-turn navigation, scenario triggers, and Gemini AI reasoning)
- **Authors**: Team Garuda

# garuda_path
