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

// Curated Indian Hotels dataset across key destinations and budget tiers
const HOTELS_DATA = [
  // Leh-Ladakh
  {
    name: 'The Grand Dragon Ladakh',
    destinationName: 'Leh-Ladakh',
    city: 'Leh',
    state: 'Ladakh',
    location: 'Old Road, Sheynam',
    pricePerNight: 9500,
    rating: 4.8,
    reviews: 420,
    amenities: JSON.stringify(['Oxygen-equipped Rooms', 'Panoramic Mountain View', 'Multi-cuisine Dining', 'Central Heating', 'Free Wi-Fi']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Stok Heritage Haveli & Homestay',
    destinationName: 'Leh-Ladakh',
    city: 'Leh',
    state: 'Ladakh',
    location: 'Stok Village',
    pricePerNight: 3800,
    rating: 4.6,
    reviews: 210,
    amenities: JSON.stringify(['Traditional Ladakhi Kitchen', 'Bonfire Garden', 'Solar Water Heating', 'Guided Walks']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Zostel Leh Backpackers',
    destinationName: 'Leh-Ladakh',
    city: 'Leh',
    state: 'Ladakh',
    location: 'Fort Road, Near Market',
    pricePerNight: 1200,
    rating: 4.7,
    reviews: 650,
    amenities: JSON.stringify(['Rooftop Café', 'Common Room', 'High-speed Wi-Fi', 'Bicycle Rental', 'Lockers']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  },

  // Goa
  {
    name: 'Taj Exotica Resort & Spa',
    destinationName: 'Goa (North & South)',
    city: 'Benaulim',
    state: 'Goa',
    location: 'Calwaddo Beachfront',
    pricePerNight: 18500,
    rating: 4.9,
    reviews: 980,
    amenities: JSON.stringify(['Private Beach Access', 'Infinity Pool', 'Ayurvedic Spa', 'Golf Course', 'Fine Dining']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fontainhas Heritage Boutique Villa',
    destinationName: 'Goa (North & South)',
    city: 'Panaji',
    state: 'Goa',
    location: 'Latin Quarter',
    pricePerNight: 4200,
    rating: 4.7,
    reviews: 340,
    amenities: JSON.stringify(['Portuguese Architecture', 'Artisanal Bakery', 'Courtyard Patio', 'Air Conditioning']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Anjuna Palm Shacks & Hostel',
    destinationName: 'Goa (North & South)',
    city: 'Anjuna',
    state: 'Goa',
    location: 'Anjuna Beach Flea Market Road',
    pricePerNight: 1100,
    rating: 4.4,
    reviews: 512,
    amenities: JSON.stringify(['Beachside Hammocks', 'Sunset Bar', 'Scooter Rental', 'Wi-Fi']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
  },

  // Coorg
  {
    name: 'Evolve Back Kuruba Safari Lodge',
    destinationName: 'Coorg (Kodagu)',
    city: 'Madikeri',
    state: 'Karnataka',
    location: 'Karadigodu Post, Siddapur',
    pricePerNight: 22000,
    rating: 4.9,
    reviews: 840,
    amenities: JSON.stringify(['Private Plunge Pool', '300-acre Coffee Estate', 'Ayurvedic Wellness', 'Plantation Tour']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Misty Woods Coffee Estate Stay',
    destinationName: 'Coorg (Kodagu)',
    city: 'Kakkabe',
    state: 'Karnataka',
    location: 'Near Thadiyandamol Peak',
    pricePerNight: 4500,
    rating: 4.7,
    reviews: 310,
    amenities: JSON.stringify(['Estate Nature Trails', 'Kodava Traditional Dining', 'Campfire', 'Waterfalls Access']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Madikeri Heritage Backpacker Den',
    destinationName: 'Coorg (Kodagu)',
    city: 'Madikeri',
    state: 'Karnataka',
    location: 'College Road, Madikeri Town',
    pricePerNight: 1300,
    rating: 4.5,
    reviews: 290,
    amenities: JSON.stringify(['High-speed Wi-Fi', 'Coffee Bar', 'Trek Guiding', 'Hot Water']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
  },

  // Udaipur
  {
    name: 'Taj Lake Palace',
    destinationName: 'Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    location: 'Pichola Island',
    pricePerNight: 35000,
    rating: 5.0,
    reviews: 1400,
    amenities: JSON.stringify(['Marble Island Palace', 'Royal Boat Transfers', 'Jiva Spa', 'Heritage Butler Service']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Amet Haveli on Lake Pichola',
    destinationName: 'Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    location: 'Ambrai Ghat',
    pricePerNight: 6800,
    rating: 4.8,
    reviews: 620,
    amenities: JSON.stringify(['Lakeside Restaurant', 'Heritage Courtyard', 'City Palace View', 'Folk Dance']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Moustache Udaipur Hostel',
    destinationName: 'Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    location: 'Near Jagdish Temple',
    pricePerNight: 950,
    rating: 4.6,
    reviews: 730,
    amenities: JSON.stringify(['Rooftop Swimming Pool', 'Lake Sunset View', 'Café & Kitchen', 'Free Wi-Fi']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  },

  // Manali
  {
    name: 'The Himalayan Castle Resort',
    destinationName: 'Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    location: 'Hadimba Road',
    pricePerNight: 12000,
    rating: 4.8,
    reviews: 480,
    amenities: JSON.stringify(['Victorian Gothic Castle', 'Heated Outdoor Pool', 'Orchard Walks', 'Fireplaces']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Old Manali Pine & Cedar Cottage',
    destinationName: 'Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    location: 'Manu Temple Road, Old Manali',
    pricePerNight: 3200,
    rating: 4.6,
    reviews: 380,
    amenities: JSON.stringify(['Apple Orchard Views', 'Live Music Café Nearby', 'Balcony', 'Kitchenette']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Zostel Old Manali',
    destinationName: 'Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    location: 'Goshal Road, Old Manali',
    pricePerNight: 900,
    rating: 4.7,
    reviews: 950,
    amenities: JSON.stringify(['Common Garden', 'Co-working Space', 'High-speed Wi-Fi', 'Board Games', 'Café']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
  },

  // Rishikesh
  {
    name: 'Ananda in the Himalayas',
    destinationName: 'Rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    location: 'The Palace Estate, Narendra Nagar',
    pricePerNight: 32000,
    rating: 5.0,
    reviews: 720,
    amenities: JSON.stringify(['World-renowned Yoga Ashram', 'Hydrotherapy Spa', 'Organic Gourmet Diet', 'Ganga Views']),
    category: 'luxury',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ganga Kinare Riverside Retreat',
    destinationName: 'Rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    location: 'Veerbhadra Road',
    pricePerNight: 5500,
    rating: 4.7,
    reviews: 540,
    amenities: JSON.stringify(['Direct Private Ghat Access', 'Daily Morning Yoga', 'Rooftop Riverside Dining']),
    category: 'midrange',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Skyard Backpacker Ashram & Café',
    destinationName: 'Rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    location: 'Tapovan, Laxman Jhula',
    pricePerNight: 850,
    rating: 4.5,
    reviews: 410,
    amenities: JSON.stringify(['Rooftop Meditation', 'River Rafting Booking', 'Café', 'Free Wi-Fi']),
    category: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  }
];

// Curated Indian Vehicle Rentals
const VEHICLES_DATA = [
  // Bikes & Scooters
  {
    name: 'Royal Enfield Himalayan 450',
    city: 'Leh',
    state: 'Ladakh',
    type: 'Bike/Scooter',
    pricePerDay: 1800,
    rating: 4.9,
    capacity: 2,
    transmission: 'Manual',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Royal Enfield Classic 350',
    city: 'Manali',
    state: 'Himachal Pradesh',
    type: 'Bike/Scooter',
    pricePerDay: 1400,
    rating: 4.8,
    capacity: 2,
    transmission: 'Manual',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Honda Activa 6G',
    city: 'Goa',
    state: 'Goa',
    type: 'Bike/Scooter',
    pricePerDay: 450,
    rating: 4.7,
    capacity: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Honda Activa 6G',
    city: 'Puducherry',
    state: 'Pondicherry',
    type: 'Bike/Scooter',
    pricePerDay: 400,
    rating: 4.7,
    capacity: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
  },

  // SUVs & Mountain 4x4
  {
    name: 'Mahindra Thar 4x4 Convertible',
    city: 'Leh',
    state: 'Ladakh',
    type: 'SUV',
    pricePerDay: 4200,
    rating: 4.9,
    capacity: 4,
    transmission: 'Manual',
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Toyota Innova Crysta (Chauffeur / Self)',
    city: 'Madikeri',
    state: 'Karnataka',
    type: 'SUV',
    pricePerDay: 3500,
    rating: 4.9,
    capacity: 7,
    transmission: 'Manual',
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Mahindra Scorpio-N',
    city: 'Manali',
    state: 'Himachal Pradesh',
    type: 'SUV',
    pricePerDay: 3200,
    rating: 4.8,
    capacity: 6,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  },

  // Sedans & Hatchbacks
  {
    name: 'Maruti Suzuki Swift (Self-drive)',
    city: 'Goa',
    state: 'Goa',
    type: 'Self-drive',
    pricePerDay: 1500,
    rating: 4.6,
    capacity: 5,
    transmission: 'Manual',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Honda City i-VTEC',
    city: 'Udaipur',
    state: 'Rajasthan',
    type: 'Sedan',
    pricePerDay: 2200,
    rating: 4.8,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Hyundai Creta SX',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'SUV',
    pricePerDay: 2600,
    rating: 4.8,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  }
];

// Curated Traveler Community Reviews
const REVIEWS_DATA = [
  {
    destinationName: 'Leh-Ladakh',
    userName: 'Karan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 5.0,
    comment: 'Pangong Lake at sunrise was unforgettable. Voyanta weather warning saved us from crossing Chang La during high snow winds!'
  },
  {
    destinationName: 'Leh-Ladakh',
    userName: 'Priya Sundaram',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.9,
    comment: 'The day-by-day altitude adaptation timeline made all the difference. Diskit monastery in Nubra Valley is pure serenity.'
  },
  {
    destinationName: 'Coorg (Kodagu)',
    userName: 'Rahul Nair',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.8,
    comment: 'Waking up inside a private coffee estate with misty morning trails. The local Kodava cuisine recommendations were spot-on.'
  },
  {
    destinationName: 'Udaipur',
    userName: 'Ananya Mukherjee',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 5.0,
    comment: 'Lake Pichola sunset boat ride is magical. The budget optimizer helped us stay at a gorgeous lakeside haveli well within budget.'
  },
  {
    destinationName: 'Goa (North & South)',
    userName: 'Vikram Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.7,
    comment: 'South Goa beaches are so peaceful compared to the crowded spots. Loved the rented scooter route recommendations.'
  }
];

async function main() {
  console.log('--- Starting Voyanta Database Seeding (India Edition 2026) ---');

  // 1. Create or update Demo Traveler User (Alex Rivera)
  const hashedPassword = await bcrypt.hash('voyanta123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'traveler@voyanta.com' },
    update: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
    },
    create: {
      name: 'Alex Rivera',
      email: 'traveler@voyanta.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
      preferences: JSON.stringify({
        preferredVibes: ['Nature & Peace', 'Mountains', 'Café / Slow Travel'],
        defaultBudget: 'Moderate',
        travelStyle: 'Relaxed'
      })
    }
  });

  console.log(`Demo user ready: ${demoUser.name} (${demoUser.email})`);

  // 2. Seed Destinations (from dataset.json)
  for (const d of rawDataset.destinations) {
    await prisma.destination.upsert({
      where: { name: d.name },
      update: {
        state: d.state || 'India',
        country: 'India',
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
        state: d.state || 'India',
        country: 'India',
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
  console.log(`Successfully verified ${rawDataset.destinations.length} Indian destinations.`);

  // 3. Seed Hotels
  await prisma.hotel.deleteMany({});
  for (const h of HOTELS_DATA) {
    await prisma.hotel.create({ data: h });
  }
  console.log(`Successfully seeded ${HOTELS_DATA.length} curated hotels across India.`);

  // 4. Seed Vehicles
  await prisma.vehicle.deleteMany({});
  for (const v of VEHICLES_DATA) {
    await prisma.vehicle.create({ data: v });
  }
  console.log(`Successfully seeded ${VEHICLES_DATA.length} vehicle rental options.`);

  // 5. Seed Reviews
  await prisma.review.deleteMany({});
  for (const r of REVIEWS_DATA) {
    await prisma.review.create({ data: r });
  }
  console.log(`Successfully seeded ${REVIEWS_DATA.length} verified traveler reviews.`);

  // 6. Seed Authentic Indian Saved Trip for Alex (Leh-Ladakh 4-Day High-Altitude Expedition)
  await prisma.trip.deleteMany({
    where: { userId: demoUser.id }
  });

  const trip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      destinationName: 'Leh-Ladakh',
      destinationState: 'Ladakh',
      destinationCountry: 'India',
      durationDays: 4,
      travelers: 2,
      targetBudget: 48000,
      totalEstimatedCost: 42500,
      budgetTransport: 14000,
      budgetStay: 16500,
      budgetFood: 7500,
      budgetActivities: 4500,
      travelStyle: 'Relaxed',
      vibes: 'Mountains, Nature & Peace, Adventure & Trekking',
      status: 'Planned',
      notes: 'Acclimatize on Day 1. Carry warm thermals, valid photo ID for permits, and offline maps.',
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            title: 'Leh Valley Acclimatization & Stupas',
            activities: {
              create: [
                {
                  timeSlot: 'Morning (9:00 AM)',
                  title: 'Leh Heritage Old Town & Main Bazaar Stroll',
                  description: 'Gentle walk through traditional Tibetan bazaars, bakeries, and prayer wheel shrines to help acclimatize.',
                  location: 'Leh Main Bazaar',
                  coordinates: '34.1642,77.5848',
                  estimatedCost: 350,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Afternoon (1:00 PM)',
                  title: 'Artisan Ladakhi Thukpa & Herbal Sea-buckthorn Tea',
                  description: 'Authentic warm noodle broth made with Himalayan herbs and freshly pressed sea-buckthorn juice.',
                  location: 'Tibetan Kitchen, Fort Road',
                  coordinates: '34.1630,77.5815',
                  estimatedCost: 650,
                  isOutdoor: false
                },
                {
                  timeSlot: 'Evening (5:00 PM)',
                  title: 'Shanti Stupa Sunset Panorama',
                  description: 'White-domed Buddhist stupa offering 360-degree views of the Indus Valley and snow-dusted Stok Kangri range.',
                  location: 'Changspa, Leh',
                  coordinates: '34.1673,77.5755',
                  estimatedCost: 0,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Night (8:30 PM)',
                  title: 'Stargazing at Sheynam Courtyard',
                  description: 'Clear unpolluted high-altitude sky gazing under brilliant celestial constellations with warm ginger tea.',
                  location: 'Sheynam Valley',
                  coordinates: '34.1590,77.5800',
                  estimatedCost: 0,
                  isOutdoor: true
                }
              ]
            }
          },
          {
            dayNumber: 2,
            title: 'Sacred Monasteries & Magnetic Confluence',
            activities: {
              create: [
                {
                  timeSlot: 'Morning (8:30 AM)',
                  title: 'Thiksey Monastery Morning Prayer Chants',
                  description: 'Attend morning conch shells and deep brass horn chanting in the 12-storey palace-like monastery.',
                  location: 'Thiksey Village',
                  coordinates: '34.0569,77.6669',
                  estimatedCost: 100,
                  isOutdoor: false
                },
                {
                  timeSlot: 'Afternoon (1:00 PM)',
                  title: 'Indus & Zanskar River Confluence (Sangam)',
                  description: 'Witness the dramatic meeting of deep green Indus waters and roaring blue-grey Zanskar river.',
                  location: 'Nimmu Confluence',
                  coordinates: '34.1647,77.3292',
                  estimatedCost: 0,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Evening (4:30 PM)',
                  title: 'Magnetic Hill & Gurudwara Pathar Sahib',
                  description: 'Experience gravity-defying road optical phenomenon followed by tea served by army volunteers.',
                  location: 'Leh-Kargil Highway',
                  coordinates: '34.2045,77.3524',
                  estimatedCost: 0,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Night (8:00 PM)',
                  title: 'Traditional Wood-fired Apricot Pie & Coffee',
                  description: 'Cozy up in Old Leh German Bakery with freshly baked apricot crumbles and spiced cinnamon lattes.',
                  location: 'Chubi Road',
                  coordinates: '34.1655,77.5820',
                  estimatedCost: 450,
                  isOutdoor: false
                }
              ]
            }
          },
          {
            dayNumber: 3,
            title: 'Crossing Khardung La to Nubra Valley',
            activities: {
              create: [
                {
                  timeSlot: 'Morning (7:30 AM)',
                  title: 'Ascent to Khardung La Pass (17,982 ft)',
                  description: 'Traverse one of the world highest motorable passes with breathtaking views over Karakoram range.',
                  location: 'Khardung Pass',
                  coordinates: '34.2792,77.6047',
                  estimatedCost: 0,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Afternoon (1:30 PM)',
                  title: 'Diskit Monastery & Giant Golden Maitreya Buddha',
                  description: 'Marvel at the 106-foot Maitreya Buddha statue facing down the Shyok river valley towards Pakistan.',
                  location: 'Diskit, Nubra',
                  coordinates: '34.5428,77.5583',
                  estimatedCost: 150,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Evening (5:00 PM)',
                  title: 'Hunder White Sand Dunes & Double-humped Camel Ride',
                  description: 'Ride rare Bactrian camels across high-altitude white dunes with snow peaks in the backdrop.',
                  location: 'Hunder Sand Dunes',
                  coordinates: '34.5772,77.4725',
                  estimatedCost: 600,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Night (8:30 PM)',
                  title: 'Nubra Valley Riverside Campfire & Barbecue',
                  description: 'Fireside gathering under the Milky Way with local apricot skewers and folk music.',
                  location: 'Hunder Camp',
                  coordinates: '34.5780,77.4750',
                  estimatedCost: 800,
                  isOutdoor: true
                }
              ]
            }
          },
          {
            dayNumber: 4,
            title: 'Pangong Tso Color-Shifting Waters',
            activities: {
              create: [
                {
                  timeSlot: 'Morning (8:00 AM)',
                  title: 'Scenic Drive along the Shyok River Gorge',
                  description: 'Dramatic landscape drive carving through raw granite canyons and wild mountain desert.',
                  location: 'Shyok Route to Pangong',
                  coordinates: '34.3312,78.1012',
                  estimatedCost: 0,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Afternoon (12:30 PM)',
                  title: 'First View of Azure Pangong Tso Lake (14,270 ft)',
                  description: 'Watch the waters transform from deep turquoise to cobalt blue as the afternoon sun shifts.',
                  location: 'Lukung / Spangmik',
                  coordinates: '33.9167,78.6333',
                  estimatedCost: 150,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Evening (4:30 PM)',
                  title: 'Spangmik Shoreline Photography & Warm Chai',
                  description: 'Walk along the saline crystal shores with reflections of Changchenmo mountain range.',
                  location: 'Spangmik Village',
                  coordinates: '33.9050,78.6500',
                  estimatedCost: 200,
                  isOutdoor: true
                },
                {
                  timeSlot: 'Night (8:00 PM)',
                  title: 'Farewell Ladakhi Feast & Hot Butter Tea',
                  description: 'Warm celebratory meal with momos, tingmo bread, and yak butter tea before departing.',
                  location: 'Leh Guest Retreat',
                  coordinates: '34.1610,77.5830',
                  estimatedCost: 700,
                  isOutdoor: false
                }
              ]
            }
          }
        ]
      },
      expenses: {
        create: [
          { category: 'Stay', amount: 16500, description: '3 nights in Boutique Heritage Haveli + 1 night Nubra luxury camp', date: '2026-09-20' },
          { category: 'Transport', amount: 14000, description: '4-day private 4x4 vehicle with experienced mountain driver & permits', date: '2026-09-20' },
          { category: 'Food', amount: 4800, description: 'Traditional Ladakhi meals, riverside lunches, and bakery treats', date: '2026-09-21' },
          { category: 'Activities', amount: 2100, description: 'Thiksey entry, Hunder camel safari, and monastery conservation passes', date: '2026-09-22' }
        ]
      },
      checklists: {
        create: [
          { category: 'Documents', item: 'Inner Line Permit (ILP) printouts (4 copies)', completed: true },
          { category: 'Documents', item: 'Government photo ID (Aadhar/Passport)', completed: true },
          { category: 'Clothing', item: 'Layered thermal innerwear & windproof fleece jacket', completed: true },
          { category: 'Clothing', item: 'UV polarized sunglasses & SPF 50+ mountain sunscreen', completed: false },
          { category: 'Medical', item: 'Diamox for altitude acclimatization & hydration salts (ORS)', completed: true },
          { category: 'Medical', item: 'Personal first-aid kit & lip balm', completed: false },
          { category: 'Electronics', item: '20,000mAh Powerbank (batteries drain fast in sub-zero)', completed: true },
          { category: 'Essentials', item: 'Postpaid BSNL/Jio SIM card (prepaid SIMs do not work in Ladakh)', completed: false }
        ]
      }
    }
  });

  console.log(`Created sample trip: ${trip.destinationName} with expenses & packing checklist (Trip ID: ${trip.id})`);
  console.log('--- Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
