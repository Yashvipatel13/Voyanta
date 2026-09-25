const API_BASE = '/api';

const getHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('voyanta_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders
  };
};

const handleResponse = async (res, defaultErrMsg = 'Request failed') => {
  let data = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || (res.status >= 500 ? `Server error (${res.status}). Please check backend connection.` : `${defaultErrMsg} (${res.status})`);
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Registration failed');
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Login failed');
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch profile');
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to update profile');
  },

  // ML Recommendations
  async getRecommendations(params) {
    const res = await fetch(`${API_BASE}/ml/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse(res, 'Failed to get recommendations');
  },

  // Destinations
  async getDestinations(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${API_BASE}/destinations${query ? `?${query}` : ''}`);
    return handleResponse(res, 'Failed to fetch destinations');
  },

  async getDestinationByName(name) {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(name)}`);
    return handleResponse(res, 'Failed to fetch destination');
  },

  // Trip Itinerary
  async generateTrip(data) {
    const res = await fetch(`${API_BASE}/trips/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to generate trip');
  },

  async saveTrip(data) {
    const res = await fetch(`${API_BASE}/trips/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to save trip');
  },

  async getUserTrips() {
    const res = await fetch(`${API_BASE}/trips/my-trips`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch saved trips');
  },

  async getTripById(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    return handleResponse(res, 'Failed to fetch trip');
  },

  async deleteTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to delete trip');
  },

  // Weather & Smart Adaptation
  async getWeather(city) {
    const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city || 'Kyoto')}`);
    return handleResponse(res, 'Failed to fetch weather');
  },

  async adaptActivity(data) {
    const res = await fetch(`${API_BASE}/weather/adapt-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to adapt activity');
  },

  // Wishlist
  async getWishlist() {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch wishlist');
  },

  async toggleWishlist(destinationId) {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ destinationId })
    });
    return handleResponse(res, 'Failed to toggle wishlist');
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch notifications');
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to mark notification read');
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to mark all notifications read');
  },

  async deleteNotification(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to delete notification');
  },

  // Vehicles & Rentals
  async getVehicles(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/vehicles${query ? `?${query}` : ''}`);
    return handleResponse(res, 'Failed to fetch vehicles');
  },

  async getVehicleById(id) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    return handleResponse(res, 'Failed to fetch vehicle details');
  },

  // Hotels
  async getHotels(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/hotels${query ? `?${query}` : ''}`);
    return handleResponse(res, 'Failed to fetch hotels');
  },

  async getHotelById(id) {
    const res = await fetch(`${API_BASE}/hotels/${id}`);
    return handleResponse(res, 'Failed to fetch hotel details');
  },

  // Trip Tools: Expenses
  async getExpenses(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch trip expenses');
  },

  async addExpense(tripId, data) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to add expense');
  },

  async deleteExpense(tripId, expenseId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to delete expense');
  },

  // Trip Tools: Packing Checklists
  async getChecklists(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/checklists`, {
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to fetch checklists');
  },

  async addChecklistItem(tripId, data) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/checklists`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to add checklist item');
  },

  async toggleChecklistItem(tripId, itemId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/checklists/${itemId}/toggle`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to toggle checklist item');
  },

  async deleteChecklistItem(tripId, itemId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/checklists/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to delete checklist item');
  },

  async autoGenerateChecklist(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/checklists/auto-generate`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res, 'Failed to auto-generate checklist');
  },

  // AI Budget Optimizer Engine
  async optimizeBudget(data) {
    const res = await fetch(`${API_BASE}/trips/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to optimize budget');
  },

  // Community Reviews & Ratings
  async getReviews(destinationName) {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(destinationName)}/reviews`);
    return handleResponse(res, 'Failed to fetch reviews');
  },

  async createReview(destinationName, data) {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(destinationName)}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res, 'Failed to submit review');
  }
};

