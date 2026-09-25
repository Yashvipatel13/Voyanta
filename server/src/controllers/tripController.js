import { prisma } from '../prisma/client.js';

// Pre-curated activity templates per vibe and destination style
const ACTIVITY_CATALOG = {
  "Nature & Peace": [
    { title: "Scenic Sunrise Nature Trail & Birdwatching", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 0, desc: "Breathe fresh crisp mountain air and explore winding botanical pathways." },
    { title: "Tranquil Botanical Conservatory & Herbal Tea", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 20, desc: "Relax inside a climate-controlled exotic flora haven with artisanal botanical tea." },
    { title: "Sunset Lake Viewpoint & Meditation Spot", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Reflective waters reflecting dusk colors in complete tranquility." },
    { title: "Acoustic Fireside Evening & Star Gazing", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 15, desc: "Cozy fireside atmosphere under open unpolluted night skies." }
  ],
  "Adventure": [
    { title: "Canyon Ridge Trek & Suspended Bridge Crossing", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 45, desc: "High-adrenaline trek with panoramic panoramic views over the canyon." },
    { title: "Whitewater River Rafting & Cliff Leap", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 60, desc: "Grade III rapids expedition guided by experienced local river rafters." },
    { title: "Off-road Quad Bike Sunset Circuit", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 50, desc: "Rugged backcountry gravel trail riding during golden hour." },
    { title: "Expedition Basecamp Campfire & Storytelling", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 20, desc: "Share trail stories over warm local cider and grilled specialties." }
  ],
  "Culture & History": [
    { title: "Ancient Temple & Citadel Guided Heritage Walk", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 18, desc: "Walk through centuries-old stone corridors guided by an art historian." },
    { title: "National History & Archaeology Museum", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 22, desc: "Curated imperial relics, ancient pottery, and royal dynasty exhibitions." },
    { title: "Historic Old Town Plaza & Artisan Craft Market", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 15, desc: "Discover handmade leatherwork, ceramics, and regional textiles." },
    { title: "Classical Symphony Performance & Historic Cellar", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 40, desc: "Live orchestra performance inside an authentic vaulted stone chamber." }
  ],
  "Beach & Relaxation": [
    { title: "Calm Cove Morning Swim & Paddleboarding", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 25, desc: "Glide through crystal turquoise waters before the beach crowds arrive." },
    { title: "Seaside Organic Lunch & Sunbed Chillout", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 30, desc: "Fresh tropical fruit bowls and iced coconuts under swaying palm shade." },
    { title: "Sunset Catamaran Cruise & Dolphin Spotting", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 55, desc: "Sail along the coastline as the horizon turns fiery amber." },
    { title: "Barefoot Beach Lounge & Acoustic Reggae/Jazz", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 25, desc: "Tiki torches, gentle waves, and low-tempo live music by the shore." }
  ],
  "Food & Local Experience": [
    { title: "Early Morning Farmers Market & Street Food Breakfast", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 15, desc: "Sample freshly steamed dumplings, tropical fruits, and signature local coffee." },
    { title: "Hands-on Masterclass Cooking with Local Chef", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 50, desc: "Learn authentic spice blending and cook a 3-course traditional feast." },
    { title: "Secret Neighborhood Specialty Tasting Crawl", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 35, desc: "Hidden alleys, historic delicatessens, and family-owned specialty bakeries." },
    { title: "Rooftop Craft Mixology & Regional Tapas", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 45, desc: "Artisanal infusions paired with local small-plate gastronomic delights." }
  ],
  "Nightlife": [
    { title: "Late Morning Brunch & Vintage Vinyl Hunting", timeSlot: "Morning (9:00 AM)", isOutdoor: false, cost: 20, desc: "Specialty flat whites, avocado brioche, and rare retro record stores." },
    { title: "Contemporary Street Art & Underground Gallery Tour", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 15, desc: "Explore giant murals and experimental modern sculpture studios." },
    { title: "Sunset Skyline Cocktail Terrace", timeSlot: "Evening (5:00 PM)", isOutdoor: false, cost: 30, desc: "Panoramic elevated city lights with resident deep-house DJ sets." },
    { title: "Iconic Underground Music Club & Dancing", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 35, desc: "World-class sound systems, laser visuals, and electric nightlife energy." }
  ],
  "Café / Slow Travel": [
    { title: "Third-Wave Roastery Tasting & Journaling", timeSlot: "Morning (9:00 AM)", isOutdoor: false, cost: 12, desc: "Single-origin pour-over and freshly baked almond croissants with scenic window view." },
    { title: "Hidden Courtyard Bookshop & Poetry Reading", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 10, desc: "Browse curated independent literature in a sun-dappled cobblestone courtyard." },
    { title: "Canal-side Stroll & Watercolor Sketching", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Gentle unhurried walk soaking in local everyday life and scenic architecture." },
    { title: "Artisan Ceramic Tea House & Ambient Music", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 18, desc: "Warm seasonal infusion served in handcrafted clay cups with soft ambient vinyl." }
  ]
};

export const generateTripItinerary = async (req, res) => {
  try {
    const {
      destinationName,
      durationDays = 4,
      budgetTier = 'Moderate',
      travelers = 2,
      vibes = ['Nature & Peace', 'Culture & History'],
      travelStyle = 'Relaxed',
      targetBudget
    } = req.body;

    const daysCount = Math.min(Math.max(Number(durationDays) || 3, 1), 14);
    const travelerCount = Math.min(Math.max(Number(travelers) || 1, 1), 10);

    // Look up destination info if available in database
    const dest = await prisma.destination.findUnique({
      where: { name: destinationName }
    });

    const destVibes = Array.isArray(vibes) ? vibes : [vibes];
    const baseCoords = dest?.coordinates ? dest.coordinates.split(',').map(Number) : [35.0116, 135.7681];

    // Compute Budget Estimates
    const dailyBaseRate = dest?.avgCostPerDay || (budgetTier === 'Economy' ? 50 : budgetTier === 'Moderate' ? 120 : 250);
    const estTransport = Math.round(dailyBaseRate * 0.35 * daysCount * travelerCount);
    const estStay = Math.round(dailyBaseRate * 0.40 * daysCount * (travelerCount > 1 ? 1.5 : 1));
    const estFood = Math.round(dailyBaseRate * 0.25 * daysCount * travelerCount);
    
    let totalActivityCost = 0;
    const days = [];

    for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
      // Pick a primary vibe theme for the day
      const dailyVibe = destVibes[(dayNum - 1) % destVibes.length] || "Culture & History";
      const activityTemplates = ACTIVITY_CATALOG[dailyVibe] || ACTIVITY_CATALOG["Culture & History"];

      const activities = activityTemplates.map((act, index) => {
        // Slight coordinate jitter around destination center for realistic map pins
        const latJitter = (Math.random() - 0.5) * 0.035;
        const lngJitter = (Math.random() - 0.5) * 0.035;
        const lat = (baseCoords[0] + latJitter).toFixed(4);
        const lng = (baseCoords[1] + lngJitter).toFixed(4);

        const actCost = Math.round(act.cost * (budgetTier === 'Economy' ? 0.7 : budgetTier === 'Luxury' ? 1.6 : 1.0));
        totalActivityCost += actCost;

        return {
          id: `temp-act-${dayNum}-${index}`,
          timeSlot: act.timeSlot,
          title: act.title,
          description: act.desc,
          location: `${destinationName} District ${String.fromCharCode(65 + index)}`,
          coordinates: `${lat},${lng}`,
          estimatedCost: actCost,
          isOutdoor: act.isOutdoor,
          weatherAlert: null,
          replacedWith: null
        };
      });

      days.push({
        dayNumber: dayNum,
        title: `Day ${dayNum}: Exploring ${dailyVibe} & Local Gems`,
        activities
      });
    }

    const totalCost = estTransport + estStay + estFood + totalActivityCost;
    const userTargetBudget = Number(targetBudget) || Math.round(totalCost * 1.1);

    res.json({
      destinationName: dest?.name || destinationName,
      destinationCountry: dest?.country || 'Global',
      durationDays: daysCount,
      travelers: travelerCount,
      travelStyle,
      vibes: destVibes,
      budgetBreakdown: {
        transport: estTransport,
        stay: estStay,
        food: estFood,
        activities: totalActivityCost,
        totalEstimatedCost: totalCost,
        targetBudget: userTargetBudget,
        currency: 'USD',
        isOverBudget: totalCost > userTargetBudget
      },
      coordinates: dest?.coordinates || `${baseCoords[0]},${baseCoords[1]}`,
      itineraryDays: days
    });
  } catch (err) {
    console.error('Generate Itinerary error:', err);
    res.status(500).json({ error: 'Failed to generate trip itinerary.' });
  }
};

export const saveTrip = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      destinationName,
      destinationCountry,
      durationDays,
      travelers,
      targetBudget,
      totalEstimatedCost,
      budgetTransport,
      budgetStay,
      budgetFood,
      budgetActivities,
      travelStyle,
      vibes,
      itineraryDays
    } = req.body;

    const trip = await prisma.trip.create({
      data: {
        userId,
        destinationName,
        destinationCountry: destinationCountry || 'Global',
        durationDays: Number(durationDays) || 3,
        travelers: Number(travelers) || 1,
        targetBudget: Number(targetBudget) || 1000,
        totalEstimatedCost: Number(totalEstimatedCost) || 900,
        budgetTransport: Number(budgetTransport) || 0,
        budgetStay: Number(budgetStay) || 0,
        budgetFood: Number(budgetFood) || 0,
        budgetActivities: Number(budgetActivities) || 0,
        travelStyle: travelStyle || 'Relaxed',
        vibes: Array.isArray(vibes) ? vibes.join(', ') : (vibes || ''),
        status: 'Planned',
        itineraryDays: {
          create: itineraryDays.map(day => ({
            dayNumber: day.dayNumber,
            title: day.title,
            activities: {
              create: day.activities.map(act => ({
                timeSlot: act.timeSlot,
                title: act.title,
                description: act.description,
                location: act.location,
                coordinates: act.coordinates,
                estimatedCost: Number(act.estimatedCost) || 0,
                isOutdoor: Boolean(act.isOutdoor),
                weatherAlert: act.weatherAlert || null,
                replacedWith: act.replacedWith || null
              }))
            }
          }))
        }
      },
      include: {
        itineraryDays: {
          include: {
            activities: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Trip saved to your profile successfully!',
      trip
    });
  } catch (err) {
    console.error('Save trip error:', err);
    res.status(500).json({ error: 'Failed to save trip.' });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        itineraryDays: {
          include: {
            activities: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trips);
  } catch (err) {
    console.error('Get user trips error:', err);
    res.status(500).json({ error: 'Failed to fetch saved trips.' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        itineraryDays: {
          include: {
            activities: true
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    res.json(trip);
  } catch (err) {
    console.error('Get trip error:', err);
    res.status(500).json({ error: 'Failed to fetch trip details.' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this trip.' });
    }

    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    console.error('Delete trip error:', err);
    res.status(500).json({ error: 'Failed to delete trip.' });
  }
};
