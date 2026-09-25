import { prisma } from '../prisma/client.js';

// Pre-curated activity templates per vibe and destination style (India 2026, calibrated in ₹ INR)
const ACTIVITY_CATALOG = {
  "Nature & Peace": [
    { title: "Scenic Sunrise Nature Trail & Birdwatching", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 0, desc: "Breathe fresh crisp mountain air and explore winding botanical pathways." },
    { title: "Tranquil Plantation Conservatory & Herbal Tea", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 250, desc: "Relax inside a shaded flora haven with freshly brewed estate herbal tea." },
    { title: "Sunset Valley Viewpoint & Meditation Spot", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Reflective waters reflecting dusk colors in complete tranquility." },
    { title: "Acoustic Fireside Evening & Star Gazing", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 350, desc: "Cozy fireside atmosphere under open unpolluted night skies with hot spiced cider." }
  ],
  "Adventure & Trekking": [
    { title: "Canyon Ridge Trek & Suspended Bridge Crossing", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 650, desc: "High-adrenaline guided ridge trek with panoramic valley views." },
    { title: "Whitewater River Rafting & Cliff Leap", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 1400, desc: "Grade III rapids expedition guided by certified river rescue guides." },
    { title: "Off-road Quad Bike Sunset Circuit", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 950, desc: "Rugged backcountry gravel trail riding during the golden hour." },
    { title: "Expedition Basecamp Campfire & Storytelling", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 400, desc: "Share trail stories over warm local tea and barbecue specialties." }
  ],
  "Adventure": [
    { title: "Canyon Ridge Trek & Suspended Bridge Crossing", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 650, desc: "High-adrenaline guided ridge trek with panoramic valley views." },
    { title: "Whitewater River Rafting & Cliff Leap", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 1400, desc: "Grade III rapids expedition guided by certified river rescue guides." },
    { title: "Off-road Quad Bike Sunset Circuit", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 950, desc: "Rugged backcountry gravel trail riding during the golden hour." },
    { title: "Expedition Basecamp Campfire & Storytelling", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 400, desc: "Share trail stories over warm local tea and barbecue specialties." }
  ],
  "Mountains": [
    { title: "Cedar Forest Sunrise Walk & Ridge Trail", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 0, desc: "Crisp pine scented morning trail overlooking snow-capped Himalayan peaks." },
    { title: "Mountain Pass Viewpoint & Steaming Maggie/Chai", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 200, desc: "Iconic high-altitude highway stop with panoramic valley views." },
    { title: "High Altitude Monastery / Alpine Lake Visit", timeSlot: "Evening (4:30 PM)", isOutdoor: true, cost: 150, desc: "Spin ancient prayer wheels and soak in serene dusk over alpine waters." },
    { title: "Fireside Stargazing & Acoustic Folk Melodies", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 350, desc: "Warm fleece blankets and stargazing under the Milky Way." }
  ],
  "Culture & History": [
    { title: "Ancient Temple & Citadel Guided Heritage Walk", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 350, desc: "Walk through centuries-old stone corridors guided by an art historian." },
    { title: "National History & Archaeology Museum", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 250, desc: "Curated imperial relics, ancient pottery, and royal dynasty exhibitions." },
    { title: "Historic Old Town Plaza & Artisan Craft Market", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 150, desc: "Discover handmade leatherwork, ceramics, and regional textiles." },
    { title: "Classical Symphony Performance & Historic Cellar", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 600, desc: "Live classical performance inside an authentic vaulted stone chamber." }
  ],
  "Culture & Arts": [
    { title: "Heritage Art Atelier & Living Craft Workshop", timeSlot: "Morning (9:30 AM)", isOutdoor: false, cost: 400, desc: "Watch master craftsmen sculpt stone, paint miniature canvases, and carve wood." },
    { title: "Regional Folk Museum & Architectural Walk", timeSlot: "Afternoon (1:30 PM)", isOutdoor: true, cost: 200, desc: "Explore preserved traditional houses, indigenous tools, and ethnic costumes." },
    { title: "Handicrafts & Handloom Weaving Quarter", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Interact with local weavers producing world-renowned regional fabrics." },
    { title: "Live Classical Sitar & Kathak Auditorium", timeSlot: "Night (8:00 PM)", isOutdoor: false, cost: 550, desc: "Enchanting traditional classical rhythm and dance recital." }
  ],
  "History & Heritage": [
    { title: "Grand Royal Fort Complex Guided Exploration", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 450, desc: "Explore majestic battlements, carved sandstone jharokhas, and royal armories." },
    { title: "Palace Museum & Royal Carriage Collection", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 300, desc: "View crystal galleries, vintage royal cars, and medieval war artifacts." },
    { title: "Sunset Bastion Walk & Panoramic Ramparts", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 100, desc: "Watch the sun dip below the city horizon from ancient defensive walls." },
    { title: "Historic Courtyard Sound & Light Spectacle", timeSlot: "Night (8:00 PM)", isOutdoor: true, cost: 350, desc: "Dramatic laser and voice narration illuminating centuries of bravery." }
  ],
  "Beaches": [
    { title: "Calm Cove Morning Swim & Paddleboarding", timeSlot: "Morning (8:30 AM)", isOutdoor: true, cost: 300, desc: "Glide through crystal turquoise waters before the beach crowds arrive." },
    { title: "Coastal Shack Lunch & Fresh Coconut Water", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 450, desc: "Fresh regional catch, grilled catch-of-the-day, and chilled coconut bowls." },
    { title: "Sunset Catamaran Cruise & Dolphin Spotting", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 850, desc: "Sail along the coastline as the horizon turns fiery amber." },
    { title: "Barefoot Beach Shack Live Acoustic Jazz", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 350, desc: "Tiki torches, gentle waves, and low-tempo live music by the shore." }
  ],
  "Beach & Coastal": [
    { title: "Calm Cove Morning Swim & Paddleboarding", timeSlot: "Morning (8:30 AM)", isOutdoor: true, cost: 300, desc: "Glide through crystal turquoise waters before the beach crowds arrive." },
    { title: "Coastal Shack Lunch & Fresh Coconut Water", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 450, desc: "Fresh regional catch, grilled catch-of-the-day, and chilled coconut bowls." },
    { title: "Sunset Catamaran Cruise & Dolphin Spotting", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 850, desc: "Sail along the coastline as the horizon turns fiery amber." },
    { title: "Barefoot Beach Shack Live Acoustic Jazz", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 350, desc: "Tiki torches, gentle waves, and low-tempo live music by the shore." }
  ],
  "Food & Culinary": [
    { title: "Heritage Walled City Morning Food Trail & Chai", timeSlot: "Morning (9:00 AM)", isOutdoor: true, cost: 300, desc: "Sample freshly fried jalebis, kachoris, clay-cup kulhad chai, and lassi." },
    { title: "Hands-on Masterclass with Regional Chef", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 950, desc: "Learn authentic spice roasting and prepare a 3-course traditional feast." },
    { title: "Secret Neighborhood Spice & Savory Crawl", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 400, desc: "Wander through centuries-old spice lanes and family-owned dessert confectioners." },
    { title: "Rooftop Culinary Experience with Valley View", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 800, desc: "Artisanal thali paired with regional specialties under moonlit skies." }
  ],
  "Shopping & Bazaars": [
    { title: "Early Morning Artisanal Textile & Spice Bazaar", timeSlot: "Morning (9:30 AM)", isOutdoor: true, cost: 100, desc: "Browse hand-blocked prints, pashminas, and fresh single-origin spices." },
    { title: "Handicrafts Emporium & Terracotta Pottery Lane", timeSlot: "Afternoon (1:30 PM)", isOutdoor: true, cost: 200, desc: "Direct artisan purchases supporting local generational craftspeople." },
    { title: "Sunset Souk Walk & Brass Artifact Lanes", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Vibrant bustling lanes sparkling with silver jewellery and brass lamps." },
    { title: "Night Flea Market & Live Fusion Bites", timeSlot: "Night (8:30 PM)", isOutdoor: true, cost: 450, desc: "Bohemian open-air stalls with organic treats, jewellery, and folk music." }
  ],
  "Nightlife & Clubs": [
    { title: "Late Morning Brunch & Vintage Vinyl Hunting", timeSlot: "Morning (10:00 AM)", isOutdoor: false, cost: 350, desc: "Specialty flat whites, artisanal sourdough, and rare retro record stores." },
    { title: "Contemporary Street Art & Underground Gallery Tour", timeSlot: "Afternoon (1:30 PM)", isOutdoor: true, cost: 200, desc: "Explore giant murals and experimental modern sculpture studios." },
    { title: "Sunset Skyline Cocktail & Tapas Terrace", timeSlot: "Evening (5:30 PM)", isOutdoor: false, cost: 650, desc: "Panoramic elevated city lights with resident deep-house DJ sets." },
    { title: "Iconic Beachfront / Underground Music Club", timeSlot: "Night (9:00 PM)", isOutdoor: false, cost: 1200, desc: "World-class sound systems, laser visuals, and electric nightlife energy." }
  ],
  "Nature & Wildlife": [
    { title: "Dawn Wildlife Jungle Safari & Tiger Trail", timeSlot: "Morning (6:30 AM)", isOutdoor: true, cost: 1200, desc: "Open-top 4x4 jeep safari tracking big cats, elephants, and rare deer species." },
    { title: "Botanical Spice Plantation Guided Sensory Walk", timeSlot: "Afternoon (1:00 PM)", isOutdoor: true, cost: 350, desc: "Smell fresh cardamom, cloves, and vanilla beans followed by traditional lunch." },
    { title: "Sunset Lake Nature Reserve & Birdwatching", timeSlot: "Evening (4:30 PM)", isOutdoor: true, cost: 200, desc: "Peaceful boat ride spotting migratory waterbirds across wetland sanctuaries." },
    { title: "Eco-Lodge Nature Documentary & Campfire", timeSlot: "Night (8:00 PM)", isOutdoor: true, cost: 250, desc: "Screening of local biodiversity conservation tales around the hearth." }
  ],
  "Spiritual & Temples": [
    { title: "Sacred Dawn River Aarti & Temple Darshan", timeSlot: "Morning (6:00 AM)", isOutdoor: true, cost: 0, desc: "Witness ancient Sanskrit chants, oil lamps, and flower offerings by the sacred waters." },
    { title: "Guided Meditation & Vedic Philosophy Discourse", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 150, desc: "Quiet reflective mindfulness session inside a tranquil riverside ashram." },
    { title: "Grand Evening Ganga / River Ghat Aarti Ceremony", timeSlot: "Evening (5:30 PM)", isOutdoor: true, cost: 100, desc: "Hypnotic synchronized brass oil lamps and conch resonance across sacred steps." },
    { title: "Temple Langar / Satvik Prasad Shared Feast", timeSlot: "Night (8:00 PM)", isOutdoor: false, cost: 100, desc: "Wholesome community feast served in spirit of selfless hospitality." }
  ],
  "Relaxation & Wellness": [
    { title: "Sunrise Open-Air Yoga & Guided Pranayama", timeSlot: "Morning (7:30 AM)", isOutdoor: true, cost: 250, desc: "Invigorating yogic stretches and breathwork overlooking gentle valley mists." },
    { title: "Holistic Ayurvedic Abhyanga Massage & Herbal Steam", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 1800, desc: "Traditional warm medicated herbal oil therapy tailored to your dosha." },
    { title: "Herbal Infusion Tea Bar & Waterfront Hammocks", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 250, desc: "Sip restorative botanical brews while watching twilight reflections." },
    { title: "Acoustic Bamboo Flute Recital & Candlelight Dinner", timeSlot: "Night (8:00 PM)", isOutdoor: true, cost: 650, desc: "Soul-soothing classical raagas paired with organic farm-to-table cuisine." }
  ],
  "Café / Slow Travel": [
    { title: "Third-Wave Estate Roastery Tasting & Journaling", timeSlot: "Morning (9:00 AM)", isOutdoor: false, cost: 250, desc: "Single-origin pour-over and freshly baked walnut banana bread with scenic valley view." },
    { title: "Hidden Courtyard Bookshop & Poetry Reading", timeSlot: "Afternoon (1:00 PM)", isOutdoor: false, cost: 150, desc: "Browse curated independent literature in a sun-dappled courtyard." },
    { title: "Canal-side Stroll & Watercolor Sketching", timeSlot: "Evening (5:00 PM)", isOutdoor: true, cost: 0, desc: "Gentle unhurried walk soaking in local everyday life and scenic architecture." },
    { title: "Artisan Ceramic Tea House & Ambient Vinyl", timeSlot: "Night (8:30 PM)", isOutdoor: false, cost: 300, desc: "Warm seasonal infusion served in handcrafted clay cups with soft ambient vinyl." }
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
    const baseCoords = dest?.coordinates ? dest.coordinates.split(',').map(Number) : [34.1642, 77.5848];

    // Compute Budget Estimates in ₹ INR
    const dailyBaseRate = dest?.avgCostPerDay || (budgetTier === 'Economy' ? 2200 : budgetTier === 'Luxury' ? 10500 : 4500);
    const estTransport = Math.round(dailyBaseRate * 0.30 * daysCount * travelerCount);
    const estStay = Math.round(dailyBaseRate * 0.40 * daysCount * (travelerCount > 1 ? 1.4 : 1));
    const estFood = Math.round(dailyBaseRate * 0.20 * daysCount * travelerCount);
    
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
