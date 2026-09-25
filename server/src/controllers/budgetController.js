import { prisma } from '../prisma/client.js';

export const optimizeBudget = async (req, res) => {
  try {
    const {
      destinationName = 'Leh-Ladakh',
      durationDays = 4,
      travelers = 2,
      targetBudget,
      budgetTier = 'Moderate'
    } = req.body;

    const days = Math.min(Math.max(Number(durationDays) || 3, 1), 14);
    const travelerCount = Math.min(Math.max(Number(travelers) || 1, 1), 10);

    const dest = await prisma.destination.findUnique({
      where: { name: destinationName }
    });

    const baselineDailyRate = dest?.avgCostPerDay || (budgetTier === 'Economy' ? 2200 : budgetTier === 'Luxury' ? 10000 : 4500);
    const baselineTotal = Math.round(baselineDailyRate * days * travelerCount);
    const userBudget = targetBudget && !isNaN(Number(targetBudget)) ? Number(targetBudget) : baselineTotal;

    // Ideal 4-pillar budget allocation percentages
    const pillarStay = Math.round(userBudget * 0.40);
    const pillarTransport = Math.round(userBudget * 0.30);
    const pillarFood = Math.round(userBudget * 0.20);
    const pillarActivities = Math.round(userBudget * 0.10);

    // Calculate smart optimizations
    const staySaving = Math.round(pillarStay * 0.22);
    const transportSaving = Math.round(pillarTransport * 0.25);
    const foodSaving = Math.round(pillarFood * 0.18);
    const activitySaving = Math.round(pillarActivities * 0.15);

    const totalSavings = staySaving + transportSaving + foodSaving + activitySaving;
    const optimizedTotal = Math.max(userBudget - totalSavings, 1000);

    const suggestions = [
      {
        id: 'opt-stay',
        category: 'Stay & Accommodation',
        title: 'Boutique Heritage Homestay / Cottage Swap',
        description: `Selecting verified local heritage homestays or boutique stays in ${destinationName} preserves authentic charm while cutting room tariffs by ~22%.`,
        potentialSaving: staySaving,
        impact: 'High',
        tag: 'Verified Partner Stays'
      },
      {
        id: 'opt-transport',
        category: 'Local Transport & Mobility',
        title: 'Self-Drive Vehicle / Two-Wheeler Mix',
        description: `Renting a Royal Enfield bike or local scooter for in-city day exploration instead of full-day chauffeur cabs saves approx ₹${transportSaving.toLocaleString('en-IN')}.`,
        potentialSaving: transportSaving,
        impact: 'High',
        tag: 'Smart Mobility'
      },
      {
        id: 'opt-food',
        category: 'Dining & Culinary',
        title: 'Iconic Regional Eateries & Food Walks',
        description: `Dining at legendary local thali joints, bakeries, and heritage street stalls rather than in-hotel restaurants yields authentic flavors and saves ₹${foodSaving.toLocaleString('en-IN')}.`,
        potentialSaving: foodSaving,
        impact: 'Medium',
        tag: 'Culinary Trail'
      },
      {
        id: 'opt-activities',
        category: 'Sightseeing & Passes',
        title: 'Direct Conservation & Off-Peak Booking',
        description: `Visiting major monuments and heritage sites during morning golden hours avoids tour-agent markups and peak surge rates.`,
        potentialSaving: activitySaving,
        impact: 'Moderate',
        tag: 'Direct Pass'
      }
    ];

    res.json({
      destinationName,
      durationDays: days,
      travelers: travelerCount,
      currency: 'INR (₹)',
      originalBudget: userBudget,
      optimizedBudget: optimizedTotal,
      totalSavings,
      savingsPercentage: Math.round((totalSavings / userBudget) * 100),
      currentPillars: {
        stay: pillarStay,
        transport: pillarTransport,
        food: pillarFood,
        activities: pillarActivities
      },
      optimizedPillars: {
        stay: pillarStay - staySaving,
        transport: pillarTransport - transportSaving,
        food: pillarFood - foodSaving,
        activities: pillarActivities - activitySaving
      },
      suggestions
    });
  } catch (err) {
    console.error('Error in budget optimizer:', err);
    res.status(500).json({ error: 'Failed to optimize budget.' });
  }
};
