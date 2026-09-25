import { prisma } from '/Users/vddocs/Voyanta/server/src/prisma/client.js';

const API = 'http://localhost:5001/api';

async function runVerification() {
  console.log('===========================================================');
  console.log('🚀 COMPREHENSIVE END-TO-END FLOW & RELATIONAL VERIFICATION');
  console.log('===========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // FLOW 1: Authentication & User Profile Relation
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Auth & User Profile Flow ---');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'traveler@voyanta.com', password: 'voyanta123' })
    });
    const authData = await loginRes.json();
    assert(loginRes.ok && authData.user?.id === 'u1', `Login successful and returned user ID: ${authData.user?.id}`);
    const token = authData.token;

    const profileRes = await fetch(`${API}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    assert(profileRes.ok && profileData.user?.email === 'traveler@voyanta.com', `Profile fetched correctly: ${profileData.user?.name}`);

    // -------------------------------------------------------------
    // FLOW 2: Wishlist Foreign Key Relational Flow
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Wishlist & Destination Relations ---');
    // Toggle save dest_jaipur
    const wishToggleRes1 = await fetch(`${API}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ destinationId: 'dest_jaipur' })
    });
    const toggleData1 = await wishToggleRes1.json();
    assert(wishToggleRes1.ok, `Toggled wishlist: ${toggleData1.message}`);

    const wishListRes = await fetch(`${API}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const wishlist = await wishListRes.json();
    assert(Array.isArray(wishlist) && wishlist.length > 0, `Wishlist contains ${wishlist.length} destinations`);
    const firstItem = wishlist[0];
    assert(!!firstItem?.destination?.name, `Wishlist correctly joined Destination: ${firstItem?.destination?.name} (${firstItem?.destinationId})`);


    // -------------------------------------------------------------
    // FLOW 3: Trip -> ItineraryDays -> Activities Relational Flow
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Trip -> Day -> Activity Deep Nesting ---');
    const genRes = await fetch(`${API}/trips/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationName: 'Coorg (Kodagu)',
        durationDays: 3,
        travelers: 2,
        vibes: ['Nature', 'Café / Slow Travel', 'Mountains'],
        budgetTier: 'Moderate'
      })
    });
    const generatedTrip = await genRes.json();
    assert(genRes.ok && generatedTrip.itineraryDays?.length === 3, `Generated 3-day itinerary for Coorg`);

    // Save Trip
    const saveTripRes = await fetch(`${API}/trips/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(generatedTrip)
    });
    const savedData = await saveTripRes.json();
    const testTrip = savedData.trip;
    assert(saveTripRes.ok && testTrip?.id, `Trip saved to DB with ID: ${testTrip?.id}`);
    assert(testTrip.itineraryDays?.length === 3, `Saved Trip has 3 ItineraryDays connected`);
    assert(testTrip.itineraryDays[0]?.activities?.length > 0, `Day 1 has ${testTrip.itineraryDays[0]?.activities?.length} Activities connected`);

    // -------------------------------------------------------------
    // FLOW 4: Trip -> Expense Ledger Relational Flow
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Trip -> Expense Ledger Relations ---');
    const addExpRes = await fetch(`${API}/trips/${testTrip.id}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        category: 'Food',
        amount: 1850,
        description: 'Authentic Kodava pandi curry & rice roti lunch',
        date: '2026-09-26'
      })
    });
    const expResult = await addExpRes.json();
    const createdExp = expResult.expense || expResult;
    assert(addExpRes.ok && createdExp.amount === 1850, `Added expense ₹${createdExp.amount} connected to Trip ${testTrip.id}`);

    const getExpRes = await fetch(`${API}/trips/${testTrip.id}/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expLedger = await getExpRes.json();
    assert(getExpRes.ok && expLedger.expenses?.length >= 1, `Fetched expense ledger containing ${expLedger.expenses?.length} items`);
    assert(expLedger.summary?.totalSpent >= 1850, `Expense total spent aggregated to ₹${expLedger.summary?.totalSpent}`);

    // -------------------------------------------------------------
    // FLOW 5: Trip -> Checklist Relational Flow
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Trip -> Packing Checklist Relations ---');
    const addChkRes = await fetch(`${API}/trips/${testTrip.id}/checklists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        item: 'Coorg organic coffee thermos flask',
        category: 'Essentials'
      })
    });
    const newChk = await addChkRes.json();
    assert(addChkRes.ok && newChk.item.includes('coffee thermos'), `Custom checklist item added`);

    // Toggle checklist
    const toggleChkRes = await fetch(`${API}/trips/${testTrip.id}/checklists/${newChk.id}/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    const toggledItem = await toggleChkRes.json();
    assert(toggleChkRes.ok && toggledItem.completed === true, `Checklist item toggled to completed: true`);

    // Auto-generate checklist items
    const autoChkRes = await fetch(`${API}/trips/${testTrip.id}/checklists/auto-generate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const autoChkData = await autoChkRes.json();
    assert(autoChkRes.ok && autoChkData.items?.length > 0, `Auto-generated ${autoChkData.items?.length} climate-specific packing items`);

    // -------------------------------------------------------------
    // FLOW 6: AI Budget Optimizer Flow
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing AI Budget Optimizer Flow ---');
    const optRes = await fetch(`${API}/trips/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationName: 'Coorg (Kodagu)',
        durationDays: 3,
        travelers: 2,
        targetBudget: 35000,
        budgetTier: 'Moderate'
      })
    });
    const optData = await optRes.json();
    assert(optRes.ok && optData.totalSavings > 0, `Budget optimizer calculated ₹${optData.totalSavings} in savings across 4 pillars`);
    assert(optData.suggestions?.length >= 3, `Generated ${optData.suggestions?.length} concrete actionable saving swaps`);

    // -------------------------------------------------------------
    // FLOW 7: Hotels & Vehicle Rentals Service Flow
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Hotels & Vehicles Search Filters ---');
    const hotelRes = await fetch(`${API}/hotels?destination=Coorg`);
    const hotels = await hotelRes.json();
    assert(hotelRes.ok && hotels.length > 0, `Found ${hotels.length} curated hotels in Coorg (e.g. ${hotels[0]?.name})`);

    const vehRes = await fetch(`${API}/vehicles?city=Leh`);
    const vehicles = await vehRes.json();
    assert(vehRes.ok && vehicles.length > 0, `Found ${vehicles.length} rental vehicles in Leh (e.g. ${vehicles[0]?.name})`);

    // -------------------------------------------------------------
    // FLOW 8: Community Reviews & Ratings Relational Flow
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Community Reviews & Ratings ---');
    const createRevRes = await fetch(`${API}/destinations/Coorg%20(Kodagu)/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        rating: 5,
        comment: 'The coffee blossom aroma in early spring is unmatched! Great local stay experience.'
      })
    });
    const revResult = await createRevRes.json();
    assert(createRevRes.ok && revResult.review?.rating === 5, `Posted verified traveler review for Coorg`);

    const getRevRes = await fetch(`${API}/destinations/Coorg%20(Kodagu)/reviews`);
    const reviewsFeed = await getRevRes.json();
    assert(getRevRes.ok && reviewsFeed.reviews?.length > 0, `Destination reviews feed returned ${reviewsFeed.reviews?.length} reviews with avg rating: ${reviewsFeed.averageRating}`);

    // -------------------------------------------------------------
    // FLOW 9: Cascade Delete Verification
    // -------------------------------------------------------------
    console.log('\n--- 9. Testing Cascade Deletion Integrity ---');
    const delRes = await fetch(`${API}/trips/${testTrip.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert(delRes.ok, `Deleted test trip ${testTrip.id}`);

    // Verify DB foreign keys cascaded cleanly
    const orphanedDays = await prisma.itineraryDay.findMany({ where: { tripId: testTrip.id } });
    const orphanedExp = await prisma.expense.findMany({ where: { tripId: testTrip.id } });
    const orphanedChk = await prisma.checklist.findMany({ where: { tripId: testTrip.id } });
    assert(orphanedDays.length === 0, `Cascade verified: 0 orphaned ItineraryDays remaining`);
    assert(orphanedExp.length === 0, `Cascade verified: 0 orphaned Expenses remaining`);
    assert(orphanedChk.length === 0, `Cascade verified: 0 orphaned Checklists remaining`);

    console.log('\n===========================================================');
    console.log(`🎉 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
    console.log('===========================================================');

  } catch (err) {
    console.error('Fatal test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
