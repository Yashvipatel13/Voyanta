import { prisma } from '../prisma/client.js';

export const getReviews = async (req, res) => {
  try {
    const { destinationName } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        destinationName: {
          contains: destinationName
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 5.0;

    res.json({
      destinationName,
      averageRating,
      reviewCount,
      reviews
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { destinationName } = req.params;
    const userId = req.user.userId;
    const { rating, comment } = req.body;

    if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Review comment is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, avatar: true }
    });

    const newReview = await prisma.review.create({
      data: {
        destinationName,
        userName: user?.name || 'Verified Traveler',
        userAvatar: user?.avatar || null,
        rating: Number(rating),
        comment: comment.trim()
      }
    });

    res.status(201).json({
      message: 'Review posted successfully',
      review: newReview
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
};
