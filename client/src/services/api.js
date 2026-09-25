const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('voyanta_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // ML Recommendations
  async getRecommendations(params) {
    const res = await fetch(`${API_BASE}/ml/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to get recommendations');
    }
    return res.json();
  },

  // Destinations
  async getDestinations(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${API_BASE}/destinations${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch destinations');
    return res.json();
  },

  async getDestinationByName(name) {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error('Failed to fetch destination');
    return res.json();
  },

  // Trip Itinerary
  async generateTrip(data) {
    const res = await fetch(`${API_BASE}/trips/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to generate trip');
    return res.json();
  },

  async saveTrip(data) {
    const res = await fetch(`${API_BASE}/trips/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save trip');
    return res.json();
  },

  async getUserTrips() {
    const res = await fetch(`${API_BASE}/trips/my-trips`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch saved trips');
    return res.json();
  },

  async getTripById(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    if (!res.ok) throw new Error('Failed to fetch trip');
    return res.json();
  },

  async deleteTrip(id) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete trip');
    return res.json();
  },

  // Weather & Smart Adaptation
  async getWeather(city) {
    const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city || 'Kyoto')}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  },

  async adaptActivity(data) {
    const res = await fetch(`${API_BASE}/weather/adapt-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to adapt activity');
    return res.json();
  },

  // Wishlist
  async getWishlist() {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    return res.json();
  },

  async toggleWishlist(destinationId) {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ destinationId })
    });
    if (!res.ok) throw new Error('Failed to toggle wishlist');
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark notification read');
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark all notifications read');
    return res.json();
  },

  async deleteNotification(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    return res.json();
  }
};
