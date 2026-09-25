import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { getRecommendations, getAllDestinations, getDestinationByName } from '../controllers/mlController.js';
import { generateTripItinerary, saveTrip, getUserTrips, getTripById, deleteTrip } from '../controllers/tripController.js';
import { getWeather, replaceActivityForWeather } from '../controllers/weatherController.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../controllers/notificationController.js';
import { getHotels, getHotelById, getVehicles, getVehicleById } from '../controllers/servicesController.js';
import { 
  getExpenses, addExpense, deleteExpense, 
  getChecklists, addChecklistItem, toggleChecklistItem, deleteChecklistItem, autoGenerateChecklist 
} from '../controllers/tripToolsController.js';
import { optimizeBudget } from '../controllers/budgetController.js';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Auth & User Module
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/profile', authenticateToken, updateProfile);

// ML & Destination Discovery Module
router.post('/ml/recommend', getRecommendations);
router.get('/destinations', getAllDestinations);
router.get('/destinations/:name', getDestinationByName);

// Trip Planning & Itinerary Module
router.post('/trips/generate', generateTripItinerary);
router.post('/trips/save', authenticateToken, saveTrip);
router.get('/trips/my-trips', authenticateToken, getUserTrips);
router.get('/trips/:id', getTripById);
router.delete('/trips/:id', authenticateToken, deleteTrip);

// Smart Weather Adaptation Module
router.get('/weather', getWeather);
router.post('/weather/adapt-activity', replaceActivityForWeather);

// Wishlist Module
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist/toggle', authenticateToken, toggleWishlist);

// Notifications Module
router.get('/notifications', authenticateToken, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);
router.put('/notifications/read-all', authenticateToken, markAllNotificationsRead);
router.delete('/notifications/:id', authenticateToken, deleteNotification);

// Hotels & Vehicle Rentals Service Module
router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);
router.get('/vehicles', getVehicles);
router.get('/vehicles/:id', getVehicleById);

// Trip Tools: Expense Tracker
router.get('/trips/:tripId/expenses', authenticateToken, getExpenses);
router.post('/trips/:tripId/expenses', authenticateToken, addExpense);
router.delete('/trips/:tripId/expenses/:expenseId', authenticateToken, deleteExpense);

// Trip Tools: Travel Packing Checklist
router.get('/trips/:tripId/checklists', authenticateToken, getChecklists);
router.post('/trips/:tripId/checklists', authenticateToken, addChecklistItem);
router.put('/trips/:tripId/checklists/:itemId/toggle', authenticateToken, toggleChecklistItem);
router.delete('/trips/:tripId/checklists/:itemId', authenticateToken, deleteChecklistItem);
router.post('/trips/:tripId/checklists/auto-generate', authenticateToken, autoGenerateChecklist);

// AI Budget Optimizer Engine
router.post('/trips/optimize-budget', optimizeBudget);

// Destination Reviews & Ratings Module
router.get('/destinations/:destinationName/reviews', getReviews);
router.post('/destinations/:destinationName/reviews', authenticateToken, createReview);

export default router;
