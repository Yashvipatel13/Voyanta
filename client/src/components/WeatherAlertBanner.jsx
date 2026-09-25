import React, { useState } from 'react';
import { CloudRain, AlertTriangle, ArrowRight, Sun, Wind, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

export const WeatherAlertBanner = ({ weatherData, onAdaptActivities, activeDayNumber = 1 }) => {
  const [adapting, setAdapting] = useState(false);
  const [adaptedSuccess, setAdaptedSuccess] = useState(false);

  if (!weatherData) return null;

  const currentForecast = weatherData.forecast?.find(f => f.day === activeDayNumber) || {
    condition: weatherData.current?.condition || 'Clear',
    temp: weatherData.current?.temp || '24°C',
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
      {/* Weather Header Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            {currentForecast.condition.toLowerCase().includes('rain') ? (
              <CloudRain className="w-5 h-5 text-blue-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">{weatherData.city}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                Day {activeDayNumber} Forecast
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentForecast.condition} • {currentForecast.temp}</p>
          </div>
        </div>

        {/* Live Weather Metrics */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Humidity: {weatherData.current?.humidity || '62%'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Wind: {weatherData.current?.windSpeed || '10 km/h'}</span>
          </div>
        </div>
      </div>

      {/* Smart Weather Alert Box */}
      {hasAlert && (
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-900">
                    Smart Weather Alert for Day {activeDayNumber}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-200/80 text-amber-800">
                    Rain Detected
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
                  {currentForecast.alert} Voyanta has prepared safe, verified indoor cultural alternatives.
                </p>
              </div>
            </div>

            {/* Smart Adapt Button */}
            <div className="shrink-0">
              {adaptedSuccess ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Activities Adapted!</span>
                </div>
              ) : (
                <button
                  onClick={handleAdapt}
                  disabled={adapting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
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
