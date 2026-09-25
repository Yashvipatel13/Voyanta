import { prisma } from '../prisma/client.js';

export const getHotels = async (req, res) => {
  try {
    const { destination, category, maxPrice, search } = req.query;

    const where = {};

    if (destination) {
      where.OR = [
        { destinationName: { contains: destination } },
        { city: { contains: destination } },
        { state: { contains: destination } }
      ];
    }

    if (category) {
      where.category = category.toLowerCase();
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      where.pricePerNight = { lte: Number(maxPrice) };
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search } },
        { city: { contains: search } },
        { location: { contains: search } }
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { pricePerNight: 'asc' }
      ]
    });

    const parsedHotels = hotels.map(h => ({
      ...h,
      amenities: typeof h.amenities === 'string' ? JSON.parse(h.amenities || '[]') : h.amenities
    }));

    res.json(parsedHotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels.' });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findUnique({
      where: { id }
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found.' });
    }

    res.json({
      ...hotel,
      amenities: typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities || '[]') : hotel.amenities
    });
  } catch (err) {
    console.error('Error fetching hotel by id:', err);
    res.status(500).json({ error: 'Failed to fetch hotel details.' });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const { city, type, maxPrice, fuelType } = req.query;

    const where = {};

    if (city) {
      where.OR = [
        { city: { contains: city } },
        { state: { contains: city } }
      ];
    }

    if (type) {
      where.type = { contains: type };
    }

    if (fuelType) {
      where.fuelType = { contains: fuelType };
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      where.pricePerDay = { lte: Number(maxPrice) };
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { pricePerDay: 'asc' }
      ]
    });

    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle rental not found.' });
    }

    res.json(vehicle);
  } catch (err) {
    console.error('Error fetching vehicle by id:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle details.' });
  }
};
