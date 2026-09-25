import React, { useState, useEffect } from 'react';
import { 
  Building, MapPin, Star, ShieldCheck, Sparkles, SlidersHorizontal, 
  Search, ArrowRight, X, Check, Bed, Users, Calendar, Wifi, Coffee, CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api.js';

export const Hotels = ({ setTab, openAuthModal }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortBy, setSortBy] = useState('rating');

  // Booking Modal
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [stayNights, setStayNights] = useState(3);
  const [guestCount, setGuestCount] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (selectedDestination !== 'All') filters.destination = selectedDestination;
        if (selectedCategory !== 'All') filters.category = selectedCategory.toLowerCase();
        const data = await api.getHotels(filters);
        setHotels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [selectedCategory, selectedDestination]);

  const destinations = ['All', 'Leh-Ladakh', 'Goa (North & South)', 'Coorg (Kodagu)', 'Udaipur', 'Jaipur', 'Munnar', 'Spiti Valley', 'Manali'];
  const categories = ['All', 'Luxury', 'Midrange', 'Budget'];

  const filteredHotels = hotels
    .filter(h => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        (h.state && h.state.toLowerCase().includes(q)) ||
        (h.destinationName && h.destinationName.toLowerCase().includes(q));
      const matchesPrice = Number(h.pricePerNight) <= maxPrice;
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
      return b.rating - a.rating;
    });

  const handleOpenBooking = (hotel) => {
    setSelectedHotel(hotel);
    setStayNights(3);
    setGuestCount(2);
    setBookingConfirmed(false);
    setBookingId(null);
  };

  const handleConfirmBooking = () => {
    const id = 'STAY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingId(id);
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-card">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/10 backdrop-blur-md">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span>Handpicked Stays & Heritage Haveli Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Curated Stays Across India
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From palace havelis in Rajasthan to misty coffee estate homestays in Coorg and luxury mountain retreats in Ladakh.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by hotel name, city (e.g. Leh, Udaipur, Goa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Destination Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-blue-600"
            >
              {destinations.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-blue-600"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Tiers' : c}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-blue-600"
            >
              <option value="rating">Top Rated (Default)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Price Slider Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-600">Max Tariff:</span>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-40 accent-blue-600 cursor-pointer"
            />
            <span className="font-bold text-slate-900 font-mono">₹{maxPrice.toLocaleString('en-IN')}/night</span>
          </div>

          <span className="text-slate-400 font-medium">
            Showing {filteredHotels.length} curated {filteredHotels.length === 1 ? 'property' : 'properties'}
          </span>
        </div>
      </div>

      {/* Hotels Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria or price slider to see more curated stays.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDestination('All');
              setMaxPrice(20000);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-xs hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const amenities = typeof hotel.amenities === 'string' 
              ? JSON.parse(hotel.amenities || '[]') 
              : (hotel.amenities || []);

            return (
              <div 
                key={hotel.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Section */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        hotel.category === 'luxury' 
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-500/30' 
                          : hotel.category === 'midrange'
                          ? 'bg-blue-900/80 text-blue-200 border border-blue-500/30'
                          : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30'
                      }`}>
                        {hotel.category}
                      </span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{hotel.rating}</span>
                      <span className="text-[10px] text-slate-300 font-normal">({hotel.reviews})</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{hotel.location}, {hotel.city}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {hotel.destinationName} • {hotel.state}
                      </p>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {amenities.slice(0, 3).map((amenity, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          {amenity}
                        </span>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-400">
                          +{amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                    <p className="text-lg font-extrabold text-slate-900 font-mono">
                      ₹{Number(hotel.pricePerNight).toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">/ night</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(hotel)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                  >
                    <span>Reserve Stay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reservation Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {bookingConfirmed ? 'Reservation Confirmed' : 'Reserve Property'}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedHotel(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Stay Reserved Successfully!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking confirmation ID: <span className="font-mono font-bold text-slate-800">{bookingId}</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Property:</span>
                    <span className="font-bold text-slate-800">{selectedHotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-semibold text-slate-800">{stayNights} Nights • {guestCount} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Tariff:</span>
                    <span className="font-extrabold text-blue-600 font-mono">
                      ₹{(selectedHotel.pricePerNight * stayNights).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="flex gap-4 items-center">
                  <img
                    src={selectedHotel.imageUrl}
                    alt={selectedHotel.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedHotel.name}</h4>
                    <p className="text-xs text-slate-500">{selectedHotel.location}, {selectedHotel.city}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1 font-mono">
                      ₹{Number(selectedHotel.pricePerNight).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                    </p>
                  </div>
                </div>

                {/* Duration & Guests */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nights of Stay</label>
                    <select
                      value={stayNights}
                      onChange={(e) => setStayNights(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-800 font-medium"
                    >
                      {[1, 2, 3, 4, 5, 7, 10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-800 font-medium"
                    >
                      {[1, 2, 3, 4, 5, 6].map(g => (
                        <option key={g} value={g}>{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tariff ({stayNights} nights x ₹{selectedHotel.pricePerNight.toLocaleString('en-IN')})</span>
                    <span>₹{(selectedHotel.pricePerNight * stayNights).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST & Regional Hospitality Cess (12%)</span>
                    <span>₹{Math.round(selectedHotel.pricePerNight * stayNights * 0.12).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Payable</span>
                    <span className="text-blue-600 font-mono">
                      ₹{Math.round(selectedHotel.pricePerNight * stayNights * 1.12).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
