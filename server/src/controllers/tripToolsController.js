import { prisma } from '../prisma/client.js';

// Verify trip belongs to user
const verifyTripOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId }
  });
  return trip;
};

// ==========================================
// 1. REAL-TIME EXPENSE TRACKER
// ==========================================

export const getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const targetBudget = trip.targetBudget || 0;
    const remainingBudget = targetBudget - totalSpent;

    const categoryBreakdown = {
      Stay: 0,
      Transport: 0,
      Food: 0,
      Activities: 0,
      Shopping: 0,
      Miscellaneous: 0
    };

    expenses.forEach(e => {
      const cat = categoryBreakdown[e.category] !== undefined ? e.category : 'Miscellaneous';
      categoryBreakdown[cat] += e.amount;
    });

    res.json({
      tripId,
      destinationName: trip.destinationName,
      expenses,
      summary: {
        targetBudget,
        totalSpent,
        remainingBudget,
        spentPercentage: targetBudget > 0 ? Math.min(100, Math.round((totalSpent / targetBudget) * 100)) : 0,
        categoryBreakdown
      }
    });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch trip expenses.' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const { category = 'Miscellaneous', amount, description, date } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid expense amount in ₹ is required.' });
    }

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        category,
        amount: Number(amount),
        description: description || `${category} expense`,
        date: date || new Date().toISOString().split('T')[0]
      }
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense,
      id: expense.id,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      tripId: expense.tripId
    });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Failed to add expense.' });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    await prisma.expense.deleteMany({
      where: { id: expenseId, tripId }
    });

    res.json({ message: 'Expense deleted successfully', success: true });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
};

// ==========================================
// 2. TRAVEL PACKING CHECKLIST
// ==========================================

export const getChecklists = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const items = await prisma.checklist.findMany({
      where: { tripId },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }]
    });

    const totalCount = items.length;
    const completedCount = items.filter(i => i.completed).length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    res.json({
      tripId,
      items,
      checklists: items,
      totalCount,
      completedCount,
      progressPercentage
    });
  } catch (err) {
    console.error('Error fetching checklists:', err);
    res.status(500).json({ error: 'Failed to fetch checklist items.' });
  }
};

export const addChecklistItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const { item, category = 'Essentials' } = req.body;

    if (!item || !item.trim()) {
      return res.status(400).json({ error: 'Item description is required.' });
    }

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const newItem = await prisma.checklist.create({
      data: {
        tripId,
        item: item.trim(),
        category,
        completed: false
      }
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding checklist item:', err);
    res.status(500).json({ error: 'Failed to add checklist item.' });
  }
};

export const toggleChecklistItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const existing = await prisma.checklist.findFirst({
      where: { id: itemId, tripId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Checklist item not found.' });
    }

    const updated = await prisma.checklist.update({
      where: { id: itemId },
      data: { completed: !existing.completed }
    });

    res.json(updated);
  } catch (err) {
    console.error('Error toggling checklist item:', err);
    res.status(500).json({ error: 'Failed to toggle checklist item.' });
  }
};

export const deleteChecklistItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    await prisma.checklist.deleteMany({
      where: { id: itemId, tripId }
    });

    res.json({ message: 'Checklist item deleted', success: true });
  } catch (err) {
    console.error('Error deleting checklist item:', err);
    res.status(500).json({ error: 'Failed to delete checklist item.' });
  }
};

export const autoGenerateChecklist = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    const trip = await verifyTripOwnership(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    const dest = await prisma.destination.findUnique({
      where: { name: trip.destinationName }
    });

    const vibes = (trip.vibes || dest?.vibes || '').toLowerCase();
    const destName = trip.destinationName.toLowerCase();

    // Base essentials for any Indian travel
    const smartItems = [
      { category: 'Documents', item: 'Government Photo ID (Aadhaar / Passport)' },
      { category: 'Documents', item: 'Flight / Train / Hotel confirmation printouts' },
      { category: 'Electronics', item: 'Fast Multi-port Charger & USB Cables' },
      { category: 'Electronics', item: '10,000mAh+ Portable Power Bank' },
      { category: 'Medical', item: 'Personal first-aid kit & basic medications' },
      { category: 'Medical', item: 'Hand sanitizer & disinfectant wipes' },
      { category: 'Essentials', item: 'Cash in small ₹ denominations for local vendors' },
      { category: 'Essentials', item: 'Reusable insulated water bottle' }
    ];

    // High-altitude & Mountains (Leh, Spiti, Manali, Gulmarg)
    if (vibes.includes('mountain') || destName.includes('leh') || destName.includes('spiti') || destName.includes('manali') || destName.includes('gulmarg')) {
      smartItems.push(
        { category: 'Clothing', item: 'Layered thermal innerwear (top & bottom)' },
        { category: 'Clothing', item: 'Windproof & water-resistant outer jacket' },
        { category: 'Clothing', item: 'Woolen beanie cap and fleece neck gaiter' },
        { category: 'Medical', item: 'Diamox for high-altitude acclimatization & ORS salts' },
        { category: 'Essentials', item: 'UV400 Polarized mountain sunglasses & SPF 50+ sunscreen' },
        { category: 'Documents', item: 'Inner Line Permit (ILP) copies for restricted checkposts' }
      );
    }

    // Coastal & Beach (Goa, Gokarna, Andaman, Varkala, Pondicherry)
    if (vibes.includes('beach') || destName.includes('goa') || destName.includes('gokarna') || destName.includes('andaman') || destName.includes('varkala')) {
      smartItems.push(
        { category: 'Clothing', item: 'Lightweight breathable linen shirts & shorts' },
        { category: 'Clothing', item: 'Swimwear and quick-dry cover-ups' },
        { category: 'Essentials', item: 'Waterproof dry pouch for phone & valuables' },
        { category: 'Essentials', item: 'Broad-spectrum water-resistant sunscreen & Aloe gel' },
        { category: 'Clothing', item: 'Beach sandals / waterproof slip-ons' }
      );
    }

    // Spiritual & Heritage (Varanasi, Rishikesh, Amritsar, Hampi)
    if (vibes.includes('spiritual') || vibes.includes('culture') || destName.includes('varanasi') || destName.includes('rishikesh')) {
      smartItems.push(
        { category: 'Clothing', item: 'Modest shoulder-covering ethnic wear for temples / aartis' },
        { category: 'Clothing', item: 'Slip-on shoes for frequent temple shoe-stands' },
        { category: 'Essentials', item: 'Cotton scarf / dupatta for sun & dust protection' }
      );
    }

    // Adventure & Trekking
    if (vibes.includes('adventure') || destName.includes('bir') || destName.includes('rishikesh')) {
      smartItems.push(
        { category: 'Clothing', item: 'Sturdy high-traction trekking shoes' },
        { category: 'Essentials', item: 'Compact LED headlamp or flashlight' },
        { category: 'Essentials', item: 'High-energy trail nut mix & electrolytes' }
      );
    }

    // Check which items are already in the database
    const existing = await prisma.checklist.findMany({
      where: { tripId },
      select: { item: true }
    });
    const existingSet = new Set(existing.map(e => e.item.toLowerCase()));

    const toCreate = smartItems
      .filter(si => !existingSet.has(si.item.toLowerCase()))
      .map(si => ({
        tripId,
        category: si.category,
        item: si.item,
        completed: false
      }));

    if (toCreate.length > 0) {
      await prisma.checklist.createMany({
        data: toCreate
      });
    }

    const allItems = await prisma.checklist.findMany({
      where: { tripId },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }]
    });

    res.json({
      message: `Generated ${toCreate.length} smart packing items based on ${trip.destinationName} profile.`,
      addedCount: toCreate.length,
      items: allItems,
      checklists: allItems,
      totalCount: allItems.length,
      completedCount: allItems.filter(i => i.completed).length
    });
  } catch (err) {
    console.error('Error generating checklist:', err);
    res.status(500).json({ error: 'Failed to generate smart packing checklist.' });
  }
};
