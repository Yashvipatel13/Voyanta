import { prisma } from '../prisma/client.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check count of notifications for user
    const count = await prisma.notification.count({
      where: { userId }
    });

    // If new user or no notifications, seed default initial travel notifications
    if (count === 0) {
      await prisma.notification.createMany({
        data: [
          {
            userId,
            title: 'Welcome to Voyanta 2026 ✨',
            message: 'Your AI travel planner is ready. Select any vibe to generate your bespoke itinerary.',
            type: 'info',
            link: '#planner',
            read: false
          },
          {
            userId,
            title: 'Route Forecast: Leh-Ladakh',
            message: 'Clear skies and favorable travel conditions reported across mountain routes.',
            type: 'weather',
            link: '#planner',
            read: false
          },
          {
            userId,
            title: 'Smart Budget Alert',
            message: 'Boutique stays in Himachal Pradesh and Udaipur currently offer 15% off-season savings.',
            type: 'budget',
            link: '#explore',
            read: false
          }
        ]
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true }
    });

    res.json({ message: 'Notification marked as read', success: true });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ error: 'Failed to update notification.' });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });

    res.json({ message: 'All notifications marked as read', success: true });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await prisma.notification.deleteMany({
      where: { id, userId }
    });

    res.json({ message: 'Notification deleted', success: true });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
};
