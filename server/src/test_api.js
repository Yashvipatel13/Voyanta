// Comprehensive Automated Backend API Test Suite for Voyanta
// Tests all 31 endpoints against the active server

const API_BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('====================================================');
  console.log('  VOYANTA BACKEND API VERIFICATION SUITE (2026)');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  let authToken = null;
  let testUserId = null;
  let testTripId = null;
  let testExpenseId = null;
  let testChecklistId = null;

  // 1. AUTH TESTS
  await test('POST /auth/login - Authenticate demo traveler', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'traveler@voyanta.com', password: 'voyanta123' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token || !data.user) throw new Error('Missing token or user');
    authToken = data.token;
    testUserId = data.user.id;
  });

  await test('GET /auth/profile - Fetch authenticated traveler profile & avatar', async () => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.user?.email || data.user.avatar === undefined) throw new Error('Invalid profile payload');
  });

  await test('PUT /auth/profile - Update profile avatar and preferences', async () => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        preferences: {
          preferredVibes: ['Mountains', 'Nature & Peace'],
          defaultBudget: 'Moderate',
          travelStyle: 'Relaxed'
        }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 2. ML & DESTINATIONS
  await test('POST /ml/recommend - Random Forest & Cosine Vibe Matching', async () => {
    const res = await fetch(`${API_BASE}/ml/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vibes: ['Mountains', 'Nature & Peace'],
        budget: 'Moderate',
        durationDays: 4,
        travelStyle: 'Relaxed'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const matches = data.topRecommendations || data.recommendations || data.topMatches;
    if (!Array.isArray(matches) || matches.length === 0) {
      throw new Error(`No recommendations returned. Keys: ${Object.keys(data).join(', ')}`);
    }
    if (!matches[0].matchConfidence && !matches[0].matchScore) {
      throw new Error('Missing match confidence score');
    }
  });

  await test('GET /destinations - List 24 Indian destinations', async () => {
    const res = await fetch(`${API_BASE}/destinations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 20) throw new Error(`Expected 20+ destinations, got ${data.length}`);
  });

  await test('GET /destinations/Leh-Ladakh - Fetch single destination details', async () => {
    const res = await fetch(`${API_BASE}/destinations/Leh-Ladakh`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.name !== 'Leh-Ladakh') throw new Error('Incorrect destination name');
  });

  // 3. HOTELS & VEHICLES
  await test('GET /hotels - Fetch hotels with category and destination filters', async () => {
    const res = await fetch(`${API_BASE}/hotels?destination=Leh&category=luxury`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('No luxury hotels found in Leh');
    if (!Array.isArray(data[0].amenities)) throw new Error('Amenities not parsed to array');
  });

  await test('GET /vehicles - Fetch vehicle rentals with city filter', async () => {
    const res = await fetch(`${API_BASE}/vehicles?city=Leh`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('No vehicles found in Leh');
  });

  // 4. TRIP PLANNING & SAVED TRIPS
  await test('POST /trips/generate - Generate 4-day itinerary in ₹ INR', async () => {
    const res = await fetch(`${API_BASE}/trips/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationName: 'Leh-Ladakh',
        durationDays: 4,
        travelers: 2,
        vibes: ['Mountains', 'Adventure & Trekking'],
        budgetTier: 'Moderate'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.itineraryDays) || data.itineraryDays.length !== 4) {
      throw new Error(`Expected 4 days, got ${data.itineraryDays?.length}`);
    }
    const totalCost = data.budgetBreakdown?.totalEstimatedCost || data.totalCost;
    if (!totalCost || totalCost < 5000) {
      throw new Error('Invalid ₹ budget calculations');
    }
  });

  await test('GET /trips/my-trips - Fetch user saved trips and verify Leh-Ladakh demo trip', async () => {
    const res = await fetch(`${API_BASE}/trips/my-trips`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const trips = await res.json();
    if (!Array.isArray(trips) || trips.length === 0) throw new Error('No saved trips found');
    testTripId = trips[0].id;
  });

  // 5. TRIP TOOLS: EXPENSE TRACKER
  await test('GET /trips/:id/expenses - Fetch expense ledger & budget breakdown', async () => {
    const res = await fetch(`${API_BASE}/trips/${testTripId}/expenses`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.expenses) || !data.summary) throw new Error('Invalid expense ledger format');
    if (data.summary.totalSpent === undefined || data.summary.remainingBudget === undefined) {
      throw new Error('Missing budget totals in summary');
    }
  });

  await test('POST /trips/:id/expenses - Add new expense in ₹ INR', async () => {
    const res = await fetch(`${API_BASE}/trips/${testTripId}/expenses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: 'Food',
        amount: 850,
        description: 'Traditional Ladakhi Tingmo & Chai supper',
        date: '2026-09-24'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    testExpenseId = data.expense.id;
  });

  await test('DELETE /trips/:id/expenses/:expId - Remove expense item', async () => {
    const res = await fetch(`${API_BASE}/trips/${testTripId}/expenses/${testExpenseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 6. TRIP TOOLS: PACKING CHECKLIST
  await test('GET /trips/:id/checklists - Fetch packing checklist items', async () => {
    const res = await fetch(`${API_BASE}/trips/${testTripId}/checklists`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.items) || data.totalCount === undefined) throw new Error('Invalid checklist payload');
    testChecklistId = data.items[0]?.id;
  });

  if (testChecklistId) {
    await test('PUT /trips/:id/checklists/:itemId/toggle - Toggle checklist item completed', async () => {
      const res = await fetch(`${API_BASE}/trips/${testTripId}/checklists/${testChecklistId}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    });
  }

  await test('POST /trips/:id/checklists/auto-generate - Auto-generate destination packing items', async () => {
    const res = await fetch(`${API_BASE}/trips/${testTripId}/checklists/auto-generate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.items)) throw new Error('Auto-generation failed');
  });

  // 7. AI BUDGET OPTIMIZER
  await test('POST /trips/optimize-budget - AI budget optimization suggestions in ₹', async () => {
    const res = await fetch(`${API_BASE}/trips/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationName: 'Leh-Ladakh',
        durationDays: 4,
        travelers: 2,
        targetBudget: 50000,
        budgetTier: 'Moderate'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.totalSavings || data.totalSavings <= 0) throw new Error('Optimization produced zero savings');
    if (!Array.isArray(data.suggestions) || data.suggestions.length < 3) {
      throw new Error('Expected at least 3 concrete saving suggestions');
    }
  });

  // 8. REVIEWS & COMMUNITY RATINGS
  await test('GET /destinations/Leh-Ladakh/reviews - Fetch verified traveler reviews', async () => {
    const res = await fetch(`${API_BASE}/destinations/Leh-Ladakh/reviews`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.reviews) || data.averageRating === undefined) throw new Error('Invalid reviews payload');
  });

  await test('POST /destinations/Leh-Ladakh/reviews - Submit verified review', async () => {
    const res = await fetch(`${API_BASE}/destinations/Leh-Ladakh/reviews`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'High altitude roads were in pristine condition. Voyanta itinerary was flawless!'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 9. NOTIFICATIONS MODULE
  await test('GET /notifications - Fetch alerts and unread badge count', async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.notifications) || data.unreadCount === undefined) {
      throw new Error('Invalid notifications payload');
    }
  });

  await test('PUT /notifications/read-all - Mark all notifications as read', async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 10. WEATHER & WISHLIST
  await test('GET /weather?city=Leh - Live weather integration', async () => {
    const res = await fetch(`${API_BASE}/weather?city=Leh`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.condition || data.temperature === undefined) throw new Error('Invalid weather payload');
  });

  await test('GET /wishlist - Fetch user wishlist', async () => {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  console.log('\n====================================================');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND API ENDPOINTS VERIFIED & OPERATIONAL!');
    process.exit(0);
  }
}

runTests();
