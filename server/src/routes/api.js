import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { getRecommendations, getAllDestinations, getDestinationByName } from '../controllers/mlController.js';
import { generateTripItinerary, saveTrip, getUserTrips, getTripById, deleteTrip } from '../controllers/tripController.js';
import { getWeather, replaceActivityForWeather } from '../controllers/weatherController.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
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

export default router;
