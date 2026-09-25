import React, { useState, useEffect } from 'react';
import { 
  Car, Bike, Fuel, Users, ShieldCheck, Calendar, MapPin, 
  Star, Search, CheckCircle2, SlidersHorizontal, Sparkles, 
  Clock, ArrowRight, X, Phone, AlertCircle
} from 'lucide-react';
import { api } from '../services/api.js';

export const Vehicles = ({ setTab, openAuthModal }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('rating');
  
  // Booking Modal State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDays, setBookingDays] = useState(3);
  const [driverOption, setDriverOption] = useState('self'); // 'self' | 'chauffeur'
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (selectedCity !== 'All') filters.city = selectedCity;
        if (selectedType !== 'All') filters.type = selectedType;
        const data = await api.getVehicles(filters);
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [selectedType, selectedCity]);

  // Cities extracted dynamically + curated defaults
  const cities = ['All', 'Leh', 'Manali', 'Goa', 'Puducherry', 'Udaipur', 'Jaipur', 'Madikeri'];
  const types = ['All', 'Bike/Scooter', 'SUV', 'Sedan', 'Self-drive'];

  // Filter & sort
  const filteredVehicles = vehicles
    .filter(v => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        (v.state && v.state.toLowerCase().includes(q)) ||
        v.type.toLowerCase().includes(q);
      const matchesPrice = v.pricePerDay <= maxPrice;
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      return b.rating - a.rating;
    });

  const handleOpenBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingDays(3);
    setDriverOption('self');
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    setBookingId('VY-RIDE-' + Math.floor(100000 + Math.random() * 900000));
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* 1. Header Banner matching Explore / Voyanta Theme */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <span className="text-blue-600 font-bold">✦</span>
            <span>LOCAL RIDES & EXPEDITION FLEET</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Rent Your Ideal Ride Across India
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            High-altitude Royal Enfields in Leh & Manali, open Thar 4x4s for mountain expeditions, coastal scooters for Goa, and chauffeur-driven cruisers.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Security Deposit</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Verified Fleet</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Doorstep Delivery Available</span>
            </div>
          </div>
        </div>

        {/* Scenic Vehicle Thumbnail Preview */}
        <div className="hidden md:block w-48 h-36 rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80"
            alt="Royal Enfield Mountain Explorer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search car, bike model, city, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Price Range Slider */}
          <div className="md:col-span-3 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Max Price:</span>
              <span className="text-blue-600 font-bold">₹{maxPrice.toLocaleString('en-IN')} / day</span>
            </div>
            <input
              type="range"
              min="400"
              max="5000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
            >
              <option value="rating">Top Rated (Default)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Badges: Vehicle Types */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Type:</span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {type === 'All' ? 'All Rides' : type}
            </button>
          ))}
        </div>

        {/* Filter Badges: Indian Cities */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Destination:</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCity === city
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {city === 'All' ? 'All Locations' : `📍 ${city}`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Vehicle Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{filteredVehicles.length}</span> rental options
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No vehicles match your search</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your max price slider or select a different city or category.
            </p>
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedCity('All');
                setMaxPrice(5000);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const isBike = vehicle.type.toLowerCase().includes('bike') || vehicle.type.toLowerCase().includes('scooter');
              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                        {isBike ? <Bike className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                        {vehicle.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-slate-950" />
                        {vehicle.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Location Badge on Image */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-medium flex items-center gap-1 text-slate-100 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{vehicle.city}, {vehicle.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {vehicle.name}
                      </h3>

                      {/* Specs Tags */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{vehicle.capacity} {isBike ? 'Riders' : 'Seats'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{vehicle.transmission}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Price & Book Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Daily Rental</div>
                        <div className="text-lg font-extrabold text-slate-900">
                          ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500"> /day</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(vehicle)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Book Ride</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Interactive Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Ride Reservation</span>
                <h3 className="text-lg font-bold text-white">{selectedVehicle.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {bookingConfirmed ? (
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-slate-900">Ride Reserved!</h4>
                  <p className="text-sm text-slate-600">
                    Your booking reference is <span className="font-mono font-bold text-blue-600">{bookingId}</span>.
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    The local vehicle host in <span className="font-semibold text-slate-700">{selectedVehicle.city}</span> will contact you 2 hours prior to handover.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle:</span>
                    <span className="font-bold">{selectedVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold">{selectedVehicle.city}, {selectedVehicle.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-bold">{bookingDays} Days</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Total Amount (Pay on Pickup):</span>
                    <span className="text-emerald-600">
                      ₹{((selectedVehicle.pricePerDay + (driverOption === 'chauffeur' ? 800 : 0)) * bookingDays).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Vehicle Quick Summary */}
                <div className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center">
                  <img
                    src={selectedVehicle.imageUrl}
                    alt={selectedVehicle.name}
                    className="w-20 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div className="space-y-0.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-900 text-sm">{selectedVehicle.name}</p>
                    <p>📍 {selectedVehicle.city}, {selectedVehicle.state}</p>
                    <p>⭐ {selectedVehicle.rating} • {selectedVehicle.type} • {selectedVehicle.fuelType}</p>
                  </div>
                </div>

                {/* Rental Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Rental Duration:</span>
                    <span className="text-blue-600 font-extrabold">{bookingDays} Days</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={bookingDays}
                    onChange={(e) => setBookingDays(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>1 Day</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>

                {/* Driver Option (Cars only) */}
                {!selectedVehicle.type.toLowerCase().includes('bike') && !selectedVehicle.type.toLowerCase().includes('scooter') && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Driving Preference:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDriverOption('self')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          driverOption === 'self'
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>Self-Drive</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">Valid DL required</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDriverOption('chauffeur')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          driverOption === 'chauffeur'
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>With Chauffeur</div>
                        <div className="text-[11px] text-blue-600 font-semibold mt-0.5">+₹800 / day</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Rental ({bookingDays} days × ₹{selectedVehicle.pricePerDay})</span>
                    <span className="font-semibold text-slate-900">₹{(selectedVehicle.pricePerDay * bookingDays).toLocaleString('en-IN')}</span>
                  </div>
                  {driverOption === 'chauffeur' && (
                    <div className="flex justify-between text-blue-600">
                      <span>Chauffeur Allowance ({bookingDays} days × ₹800)</span>
                      <span className="font-semibold">+₹{(800 * bookingDays).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Insurance & roadside assist</span>
                    <span className="text-emerald-600 font-semibold">Included FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                    <span>Total Estimated Cost</span>
                    <span className="text-base text-blue-600">
                      ₹{((selectedVehicle.pricePerDay + (driverOption === 'chauffeur' ? 800 : 0)) * bookingDays).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free cancellation up to 24 hours prior to pickup. No prepayment required.</span>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Confirm Instant Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
