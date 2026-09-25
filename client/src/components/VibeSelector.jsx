import React from 'react';
import { Trees, Compass, Landmark, Palmtree, Utensils, Sparkles, Coffee } from 'lucide-react';

export const VIBE_DEFINITIONS = [
  {
    name: 'Nature & Peace',
    icon: Trees,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/40',
    activeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
    desc: 'Quiet forests, misty lakes, mountain sanctuaries, and tranquil retreats.'
  },
  {
    name: 'Adventure',
    icon: Compass,
    color: 'sky',
    gradient: 'from-sky-500/20 to-cyan-500/20',
    border: 'border-sky-500/40',
    activeBg: 'bg-sky-500/20 text-sky-300 border-sky-400',
    desc: 'Trekking, canyon descents, rafting, and adrenaline-pumping expeditions.'
  },
  {
    name: 'Culture & History',
    icon: Landmark,
    color: 'amber',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/40',
    activeBg: 'bg-amber-500/20 text-amber-300 border-amber-400',
    desc: 'Ancient castles, sacred temples, historic museums, and local folklore.'
  },
  {
    name: 'Beach & Relaxation',
    icon: Palmtree,
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/40',
    activeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400',
    desc: 'Turquoise seas, palm-fringed sands, coastal sunsets, and breezy hammocks.'
  },
  {
    name: 'Food & Local Experience',
    icon: Utensils,
    color: 'coral',
    gradient: 'from-rose-500/20 to-orange-500/20',
    border: 'border-rose-500/40',
    activeBg: 'bg-rose-500/20 text-rose-300 border-rose-400',
    desc: 'Night markets, secret alley eateries, masterclasses, and regional specialties.'
  },
  {
    name: 'Nightlife',
    icon: Sparkles,
    color: 'violet',
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/40',
    activeBg: 'bg-purple-500/20 text-purple-300 border-purple-400',
    desc: 'Rooftop lounges, underground DJ clubs, neon alleys, and vibrant midnight energy.'
  },
  {
    name: 'Café / Slow Travel',
    icon: Coffee,
    color: 'yellow',
    gradient: 'from-amber-700/20 to-yellow-600/20',
    border: 'border-amber-600/40',
    activeBg: 'bg-amber-600/20 text-amber-200 border-amber-500',
    desc: 'Third-wave roasteries, cobblestone bookshops, journal writing, and unhurried days.'
  }
];

export const VibeSelector = ({ selectedVibes = [], onChange, isCompact = false }) => {
  const toggleVibe = (vibeName) => {
    if (selectedVibes.includes(vibeName)) {
      onChange(selectedVibes.filter(v => v !== vibeName));
    } else {
      onChange([...selectedVibes, vibeName]);
    }
  };

  if (isCompact) {
    return (
      <div className="flex flex-wrap gap-2">
        {VIBE_DEFINITIONS.map(vibe => {
          const isSelected = selectedVibes.includes(vibe.name);
          const Icon = vibe.icon;
          return (
            <button
              key={vibe.name}
              type="button"
              onClick={() => toggleVibe(vibe.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isSelected
                  ? vibe.activeBg + ' shadow-xs scale-105'
                  : 'bg-surface-card/60 text-slate-300 border-surface-border hover:border-slate-500 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{vibe.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {VIBE_DEFINITIONS.map((vibe) => {
        const isSelected = selectedVibes.includes(vibe.name);
        const Icon = vibe.icon;
        return (
          <div
            key={vibe.name}
            onClick={() => toggleVibe(vibe.name)}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between select-none ${
              isSelected
                ? `${vibe.activeBg} ring-1 ring-offset-0 scale-[1.02] shadow-lg`
                : 'bg-surface-card/40 border-surface-border hover:bg-surface-card/80 hover:border-slate-600 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2.5 rounded-lg bg-surface border border-surface-border ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                isSelected ? 'bg-primary border-primary text-black' : 'border-slate-600'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-surface fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight mb-1 text-white">
                {vibe.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {vibe.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
