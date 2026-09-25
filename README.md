# Voyanta — AI & Vibe-Powered Travel Engine

> **Minor Project**: Intelligent travel planning platform pairing **Random Forest Machine Learning**, **Vibe-First Personalization**, **Dynamic Smart Weather Adaptation**, and **Interactive Map Exploration**.

---

## 🌟 Key Standout Features

### 1. 🔐 User Module
- **JWT Authentication**: User Registration, Secure Login with bcrypt password hashing, and Session Management.
- **Traveler Profile**: Custom traveler preferences (favorite vibes, default budget tier, travel style, travel history stats).
- **Quick Evaluation Mode**: Built-in 1-click Demo Account (`traveler@voyanta.com` / `voyanta123`).

### 2. 🧳 Trip Planning Wizard
- **Comprehensive Parameters**:
  - Budget Tier (Economy, Moderate, Luxury) & Target Dollar Budget ($)
  - Trip duration (1 to 10 days)
  - Number of travelers (Solo, Couple, Group 4+)
  - Season (Spring, Summer, Autumn, Winter, Monsoon)
  - Travel style (Backpacker, Relaxed, Fast-paced, Cultural, Luxury)
  - Preferred stay & transit (Boutique hotel, Resort, Train, Flight, Rental)

### 3. 🤖 ML Recommendation (Random Forest Ensemble)
- **Mathematical Modeling**: Evaluates numerical feature vectors:
  `[budget_level, duration_days, travelers_count, season_id, travel_style_id, ...vibe_indicators]`
- **Random Forest Engine**: Trained ensemble of decision trees utilizing Gini impurity reduction and random feature subspace sampling.
- **Explainability**: Transparent confidence match score (e.g. *94% Match: Kyoto, Japan*) with explicit rationale breakdown (*"Aligned with Nature & Peace + Spring season + Moderate budget"*).
- **Presentation Script**: Companion Python script `server/src/ml/train_random_forest.py` using `scikit-learn` to showcase classification accuracy and feature importances during viva.

### 4. 🎨 Vibe Personalization (7 Distinct Aesthetic Dimensions)
- 🌿 **Nature & Peace** — Tranquil trails, misty lakes, botanical gardens.
- 🧗 **Adventure** — Canyon ridge hikes, whitewater rafting, quad biking.
- 🏛️ **Culture & History** — Ancient temples, imperial palaces, heritage museums.
- 🏖️ **Beach & Relaxation** — Turquoise coves, coastal sunsets, paddleboarding.
- 🍜 **Food & Local Experience** — Night street food markets, masterclasses, artisanal bakeries.
- 🪩 **Nightlife** — Rooftop mixology, underground DJ clubs, illuminated night alleys.
- ☕ **Café / Slow Travel** — Third-wave roasteries, courtyard bookshops, quiet sketching.

### 5. 📅 Dynamic Day-Wise Itinerary
- **Chronological Time Slots**: Morning (9:00 AM), Afternoon (1:00 PM), Evening (5:00 PM), Night (8:30 PM).
- Detailed activity cards with duration, location, estimated cost, and indoor/outdoor designation.

### 6. 🌦️ Smart Weather Adaptation
- **Live Weather & Forecast Engine**: Temperature, humidity, wind, and alerts.
- **Active Weather Alert**: Detects rain or storms on outdoor stops (e.g., Day 2 high precipitation).
- **1-Click Smart Activity Replacement**: Automatically replaces vulnerable outdoor activities with verified indoor alternatives (e.g., Ceramic workshops, national museums, covered historic food halls) and adjusts the budget accordingly.

### 7. 💰 4-Pillar Budget Breakdown
- Real-time categorized cost tracking:
  - ✈️ **Transport & Transit**
  - 🏨 **Accommodation / Stays**
  - 🍽️ **Food & Dining**
  - 🎟️ **Activities & Sightseeing**
- Real-time progress bar comparing estimated cost against user's target budget, warning if plans exceed limits.

### 8. 🚗 Vehicle Rentals & Transit Module
- **Curated Fleet across Indian Hubs**: Royal Enfield Himalayan 450 & Classic 350 for mountain passes (Leh, Manali), Mahindra Thar 4x4 & Scorpio-N, Honda Activa 6G scooters for Goa & Pondicherry, Maruti Swift, and Hyundai Creta.
- **Specifications & Transmissions**: Seating capacity, fuel type (Petrol, Diesel, EV), manual/automatic gearboxes, and live daily rates in ₹.
- **Self-Drive & Chauffeur Options**: Interactive booking modal with dynamic rental day calculations, optional chauffeur guide allowance (+₹800/day), and zero-deposit reservation flow.
- **REST API Endpoints**: Filter by destination city, category, and budget cap (`/api/vehicles?city=Leh&type=SUV`).

### 9. 🗺️ Travel Information & Maps
- Embedded Leaflet dark-themed map with custom numbered pins corresponding to the day's itinerary stops.
- Interactive popups with location details, cost, and route polyline preview.

### 10. ❤️ User Data
- **Saved Trips**: Full persistence of custom generated itineraries in the database with instant reloading.
- **Wishlist**: Bookmark destinations from the explore page.
- **Notification Center**: Real-time travel alerts, route forecasts, and budget updates.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS, Lucide React, Leaflet Maps, Glassmorphism UI |
| **Backend Runtime** | Node.js with Express REST API |
| **Database ORM** | Prisma ORM 5.x |
| **Database** | PostgreSQL via **Supabase** (with SQLite local fallback for instant zero-config dev) |
| **Machine Learning** | Random Forest Classifier (`randomForest.js` Node.js implementation + `train_random_forest.py` scikit-learn script) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Backend Setup
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node src/prisma/seed.js
npm run dev
```
The server will start on `http://localhost:5001`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend will launch on `http://localhost:3000`.

---

## ⚡ Connecting to Supabase PostgreSQL (Optional)

To connect Voyanta to your live Supabase project:
1. In `server/prisma/schema.prisma`, change datasource provider from `"sqlite"` to `"postgresql"`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `server/.env`, set your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
3. Run migrations and seed:
   ```bash
   npx prisma db push
   node src/prisma/seed.js
   ```

---

## 🔬 Testing the ML Random Forest Model
To verify the Random Forest recommendation predictions directly in the terminal:
```bash
cd server
node src/ml/test_rf.js
```
To run the companion Python training script:
```bash
cd server
python src/ml/train_random_forest.py
```
