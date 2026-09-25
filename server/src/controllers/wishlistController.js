import { prisma } from '../prisma/client.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        destination: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = wishlistItems.map(item => ({
      id: item.id,
      destinationId: item.destinationId,
      destination: {
        ...item.destination,
        vibes: typeof item.destination.vibes === 'string' ? JSON.parse(item.destination.vibes) : item.destination.vibes
      },
      savedAt: item.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist items.' });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { destinationId } = req.body;

    if (!destinationId) {
      return res.status(400).json({ error: 'Destination ID is required.' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId
        }
      }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return res.json({ saved: false, message: 'Removed from wishlist.' });
    } else {
      const count = await prisma.wishlist.count();
      let wishNum = count + 1;
      let customWishId = `wish_${wishNum}`;
      while (await prisma.wishlist.findUnique({ where: { id: customWishId } })) {
        wishNum++;
        customWishId = `wish_${wishNum}`;
      }

      const created = await prisma.wishlist.create({
        data: {
          id: customWishId,
          userId,
          destinationId
        }
      });
      return res.status(201).json({ saved: true, message: 'Saved to wishlist!', item: created });
    }
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ error: 'Failed to update wishlist.' });
  }
};
