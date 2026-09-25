import { prisma } from './client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataset = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../ml/dataset.json'), 'utf8')
);

async function main() {
  console.log('Seeding Voyanta Database...');

  // 1. Create a Demo Traveler User
  const hashedPassword = await bcrypt.hash('voyanta123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'traveler@voyanta.com' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'traveler@voyanta.com',
      password: hashedPassword,
      preferences: JSON.stringify({
        preferredVibes: ['Nature & Peace', 'Culture & History', 'Café / Slow Travel'],
        defaultBudget: 'Moderate',
        travelStyle: 'Cultural'
      })
    }
  });

  console.log(`Demo user created: ${demoUser.email}`);

  // 2. Seed Destinations
  for (const d of rawDataset.destinations) {
    await prisma.destination.upsert({
      where: { name: d.name },
      update: {
        country: d.country,
        description: d.description,
        imageUrl: d.imageUrl,
        vibes: JSON.stringify(d.vibes),
        travelStyles: d.travelStyles.join(', '),
        bestSeasons: d.bestSeasons.join(', '),
        budgetTier: d.budgetTier,
        avgCostPerDay: d.avgCostPerDay,
        coordinates: d.coordinates,
        weatherCity: d.weatherCity,
        rating: d.rating,
        isTrending: d.isTrending
      },
      create: {
        name: d.name,
        country: d.country,
        description: d.description,
        imageUrl: d.imageUrl,
        vibes: JSON.stringify(d.vibes),
        travelStyles: d.travelStyles.join(', '),
        bestSeasons: d.bestSeasons.join(', '),
        budgetTier: d.budgetTier,
        avgCostPerDay: d.avgCostPerDay,
        coordinates: d.coordinates,
        weatherCity: d.weatherCity,
        rating: d.rating,
        isTrending: d.isTrending
      }
    });
  }

  console.log(`Successfully seeded ${rawDataset.destinations.length} destinations.`);

  // 3. Create a default Saved Trip for Alex to demonstrate Saved Trips feature
  const existingTrip = await prisma.trip.findFirst({
    where: { userId: demoUser.id }
  });

  if (!existingTrip) {
    const trip = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        destinationName: 'Kyoto',
        destinationCountry: 'Japan',
        durationDays: 4,
        travelers: 2,
        targetBudget: 1200,
        totalEstimatedCost: 980,
        budgetTransport: 280,
        budgetStay: 400,
        budgetFood: 180,
        budgetActivities: 120,
        travelStyle: 'Cultural',
        vibes: 'Nature & Peace, Culture & History, Café / Slow Travel',
        status: 'Planned',
        itineraryDays: {
          create: [
            {
              dayNumber: 1,
              title: 'Ancient Sanctuaries & Bamboo Paths',
              activities: {
                create: [
                  {
                    timeSlot: 'Morning (9:00 AM)',
                    title: 'Arashiyama Bamboo Grove Walk',
                    description: 'Listen to the rustling wind through towering green bamboo stalks at early dawn.',
                    location: 'Arashiyama, Ukyo Ward',
                    coordinates: '35.0169,135.6713',
                    estimatedCost: 0,
                    isOutdoor: true
                  },
                  {
                    timeSlot: 'Afternoon (1:00 PM)',
                    title: 'Tenryu-ji Zen Garden & Shojin Ryori',
                    description: 'UNESCO World Heritage dry landscape garden with seasonal temple vegetarian lunch.',
                    location: 'Saga Tenryuji',
                    coordinates: '35.0157,135.6776',
                    estimatedCost: 35,
                    isOutdoor: true
                  },
                  {
                    timeSlot: 'Evening (5:00 PM)',
                    title: 'Togetsukyo Bridge Sunset Walk',
                    description: 'Scenic sunset view over the Oi River with distant cedar mountain silhouettes.',
                    location: 'Oi River Waterfront',
                    coordinates: '35.0130,135.6775',
                    estimatedCost: 0,
                    isOutdoor: true
                  },
                  {
                    timeSlot: 'Night (8:30 PM)',
                    title: 'Traditional Gion Lantern Alley Walk & Matcha',
                    description: 'Quiet cobblestone stroll through Shirakawa canal followed by ceremonial Uji matcha.',
                    location: 'Gion District',
                    coordinates: '35.0037,135.7772',
                    estimatedCost: 15,
                    isOutdoor: false
                  }
                ]
              }
            },
            {
              dayNumber: 2,
              title: 'Vermilion Shrines & Historic Tea Houses',
              activities: {
                create: [
                  {
                    timeSlot: 'Morning (9:00 AM)',
                    title: 'Fushimi Inari 1,000 Torii Gate Pilgrimage',
                    description: 'Iconic mountain trail lined with thousands of vermilion shrine gates.',
                    location: 'Fushimi Ward',
                    coordinates: '34.9671,135.7727',
                    estimatedCost: 0,
                    isOutdoor: true
                  },
                  {
                    timeSlot: 'Afternoon (1:00 PM)',
                    title: 'Nishiki Market Culinary Tour',
                    description: 'Taste grilled wagyu skewers, savory dashi tamago, and fresh seasonal mochi.',
                    location: 'Nakagyo Ward',
                    coordinates: '35.0050,135.7649',
                    estimatedCost: 28,
                    isOutdoor: false
                  },
                  {
                    timeSlot: 'Evening (5:00 PM)',
                    title: 'Kiyomizu-dera Wooden Terrace',
                    description: 'Breathtaking panoramic view over Kyoto city from the ancient wooden stage.',
                    location: 'Higashiyama Ward',
                    coordinates: '34.9949,135.7850',
                    estimatedCost: 10,
                    isOutdoor: true
                  },
                  {
                    timeSlot: 'Night (8:30 PM)',
                    title: 'Pontocho Alley Izakaya Dining',
                    description: 'Atmospheric riverside dining along narrow lantern-lit pedestrian alleyways.',
                    location: 'Pontocho',
                    coordinates: '35.0062,135.7712',
                    estimatedCost: 40,
                    isOutdoor: false
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log(`Created sample trip: ${trip.destinationName} (ID: ${trip.id})`);
  }

  console.log('Database seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
