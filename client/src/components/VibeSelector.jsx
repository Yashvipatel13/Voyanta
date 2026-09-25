import React from 'react';
import { Trees, Compass, Landmark, Palmtree, Utensils, Sparkles, Coffee, Check } from 'lucide-react';

export const VIBE_DEFINITIONS = [
  {
    name: 'Nature & Peace',
    icon: Trees,
    desc: 'Quiet forests, lakes, mountains and more.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Adventure',
    icon: Compass,
    desc: 'Trekking, rafting, canyoning and more.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Culture & History',
    icon: Landmark,
    desc: 'Ancient temples, castles and heritage sites.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Beach & Relaxation',
    icon: Palmtree,
    desc: 'Turquoise seas, beaches and coastal sunsets.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Food & Local Experience',
    icon: Utensils,
    desc: 'Local food, markets and hidden gems.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nightlife',
    icon: Sparkles,
    desc: 'Rooftop lounges, clubs and vibrant city life.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Café & Slow Travel',
    icon: Coffee,
    desc: 'Cafés, bookshops and relaxed itineraries.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
  }
];

export const VibeSelector = ({ selectedVibes = [], onChange, variant = 'cards', maxSelect = null }) => {
  const toggleVibe = (vibeName) => {
    if (selectedVibes.includes(vibeName)) {
      onChange(selectedVibes.filter(v => v !== vibeName));
    } else {
      if (maxSelect && selectedVibes.length >= maxSelect) {
        // Replace oldest or cap
        onChange([...selectedVibes.slice(1), vibeName]);
      } else {
        onChange([...selectedVibes, vibeName]);
      }
    }
  };

  // 1. Compact Pill Badges (for quick filter strips)
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {VIBE_DEFINITIONS.map(vibe => {
          const isSelected = selectedVibes.includes(vibe.name);
          const Icon = vibe.icon;
          return (
            <button
              key={vibe.name}
              type="button"
              onClick={() => toggleVibe(vibe.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
              <span>{vibe.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Photo Cards Grid (for AI Trip Planner step 2, exactly like Screen 2 in demo)
  if (variant === 'photo-cards') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {VIBE_DEFINITIONS.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe.name);
          return (
            <div
              key={vibe.name}
              onClick={() => toggleVibe(vibe.name)}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer select-none transition-all duration-200 bg-white ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Photo Thumbnail */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-100">
                <img
                  src={vibe.image}
                  alt={vibe.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Selection Indicator in top-right */}
                <div className="absolute top-2 right-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/90 border border-slate-300 text-transparent'
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="p-2.5 space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {vibe.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                  {vibe.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. Default Clean Horizontal Selection Cards (as on Home page "Pick Your Travel Vibe")
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {VIBE_DEFINITIONS.map((vibe) => {
        const isSelected = selectedVibes.includes(vibe.name);
        const Icon = vibe.icon;
        return (
          <div
            key={vibe.name}
            onClick={() => toggleVibe(vibe.name)}
            className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-150 flex flex-col items-center text-center justify-between gap-2.5 ${
              isSelected
                ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-sm'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            {/* Top Indicator or Icon */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
            }`}>
              <Icon className="w-4.5 h-4.5" />
            </div>

            <div className="space-y-1 w-full">
              <span className={`text-xs font-semibold block leading-tight ${
                isSelected ? 'text-blue-950 font-bold' : 'text-slate-800'
              }`}>
                {vibe.name}
              </span>
            </div>

            {/* Checkmark circle */}
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white text-transparent'
            }`}>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
