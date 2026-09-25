import { mlEngine } from '../ml/randomForest.js';
import { prisma } from '../prisma/client.js';

export const getRecommendations = async (req, res) => {
  try {
    const { budget, durationDays, travelers, season, travelStyle, vibes } = req.body;

    if (!budget || !vibes || vibes.length === 0) {
      return res.status(400).json({ error: 'Budget and at least one vibe preference are required.' });
    }

    const prediction = mlEngine.predict({
      budget,
      durationDays: Number(durationDays) || 5,
      travelers: Number(travelers) || 2,
      season: season || 'Spring',
      travelStyle: travelStyle || 'Relaxed',
      vibes: Array.isArray(vibes) ? vibes : [vibes]
    });

    res.json(prediction);
  } catch (err) {
    console.error('ML Recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate ML destination recommendations.' });
  }
};

export const getAllDestinations = async (req, res) => {
  try {
    const { vibe, budget, trending } = req.query;

    const destinations = await prisma.destination.findMany({
      where: {
        ...(trending === 'true' && { isTrending: true }),
        ...(budget && { budgetTier: budget })
      },
      orderBy: { rating: 'desc' }
    });

    // Parse vibes string if stored as JSON
    const parsed = destinations.map(d => ({
      ...d,
      vibes: typeof d.vibes === 'string' ? JSON.parse(d.vibes) : d.vibes
    }));

    // Filter by vibe if provided
    const filtered = vibe
      ? parsed.filter(d => d.vibes.includes(vibe))
      : parsed;

    res.json(filtered);
  } catch (err) {
    console.error('Get all destinations error:', err);
    res.status(500).json({ error: 'Failed to fetch destinations.' });
  }
};

export const getDestinationByName = async (req, res) => {
  try {
    const { name } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { name }
    });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found.' });
    }

    res.json({
      ...destination,
      vibes: typeof destination.vibes === 'string' ? JSON.parse(destination.vibes) : destination.vibes
    });
  } catch (err) {
    console.error('Get destination error:', err);
    res.status(500).json({ error: 'Failed to fetch destination details.' });
  }
};
