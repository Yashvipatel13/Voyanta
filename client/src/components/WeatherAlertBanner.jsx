import React, { useState } from 'react';
import { CloudRain, AlertTriangle, ArrowRight, ShieldCheck, Sun, Wind, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

export const WeatherAlertBanner = ({ weatherData, onAdaptActivities, activeDayNumber = 1 }) => {
  const [adapting, setAdapting] = useState(false);
  const [adaptedSuccess, setAdaptedSuccess] = useState(false);

  if (!weatherData) return null;

  const currentForecast = weatherData.forecast?.find(f => f.day === activeDayNumber) || {
    condition: weatherData.current?.condition || 'Clear',
    temp: weatherData.current?.temp || '22°C',
    alert: activeDayNumber === 2 ? weatherData.activeAlert?.message : null
  };

  const hasAlert = !!currentForecast.alert;

  const handleAdapt = async () => {
    setAdapting(true);
    try {
      await onAdaptActivities();
      setAdaptedSuccess(true);
      setTimeout(() => setAdaptedSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdapting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mini Weather Strip */}
      <div className="glass-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            {currentForecast.condition.toLowerCase().includes('rain') ? (
              <CloudRain className="w-5 h-5 text-sky-400 animate-bounce" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{weatherData.city}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                Day {activeDayNumber} Forecast
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentForecast.condition} • {currentForecast.temp}</p>
          </div>
        </div>

        {/* Live Weather Metrics */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Humidity: {weatherData.current?.humidity || '65%'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Wind: {weatherData.current?.windSpeed || '12 km/h'}</span>
          </div>
        </div>
      </div>

      {/* Smart Weather Alert Box */}
      {hasAlert && (
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-surface-card to-amber-950/20 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-300">
                    Smart Weather Alert for Day {activeDayNumber}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Rain Detected
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {currentForecast.alert} Voyanta has prepared safe, verified indoor cultural alternatives.
                </p>
              </div>
            </div>

            {/* Smart Adapt Button */}
            <div className="flex items-center gap-2">
              {adaptedSuccess ? (
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activities Adapted!</span>
                </div>
              ) : (
                <button
                  onClick={handleAdapt}
                  disabled={adapting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-md transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{adapting ? 'Adapting...' : 'Smart Adapt to Indoor Activities'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
