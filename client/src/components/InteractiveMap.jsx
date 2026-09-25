import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const InteractiveMap = ({ activities = [], center = [35.0116, 135.7681], destinationName = 'Kyoto' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Parse center coordinates
      const [lat, lng] = Array.isArray(center) 
        ? center 
        : (typeof center === 'string' ? center.split(',').map(Number) : [35.0116, 135.7681]);

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Dark Matter tiles (super clean modern dark travel map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center & markers when activities or center changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();

    const [centerLat, centerLng] = Array.isArray(center) 
      ? center 
      : (typeof center === 'string' ? center.split(',').map(Number) : [35.0116, 135.7681]);

    if (!isNaN(centerLat) && !isNaN(centerLng)) {
      map.setView([centerLat, centerLng], 12);
    }

    const latLngs = [];

    activities.forEach((act, idx) => {
      let lat = centerLat;
      let lng = centerLng;

      if (act.coordinates) {
        const parts = act.coordinates.split(',').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          lat = parts[0];
          lng = parts[1];
        }
      }

      latLngs.push([lat, lng]);

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #38BDF8, #6366F1);
            color: #ffffff;
            font-weight: bold;
            font-size: 11px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.6);
            border: 2px solid #ffffff;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px; color: #0f172a; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #0284c7; margin-bottom: 2px;">
            ${act.timeSlot || `Stop ${idx + 1}`}
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">
            ${act.title}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 ${act.location}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600;">
            <span>Est: $${act.estimatedCost || 0}</span>
            <span style="background: ${act.isOutdoor ? '#dcfce7; color: #15803d;' : '#e0e7ff; color: #4338ca;'} padding: 2px 6px; border-radius: 4px; font-size: 10px;">
              ${act.isOutdoor ? 'Outdoor' : 'Indoor'}
            </span>
          </div>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markersLayerRef.current);
    });

    // Draw route polyline connecting the day's stops
    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: '#38BDF8',
        weight: 3,
        opacity: 0.6,
        dashArray: '6, 8'
      }).addTo(markersLayerRef.current);
    }
  }, [activities, center]);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-xl overflow-hidden border border-surface-border shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[360px]" />
      
      {/* Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-surface/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Route Map: {destinationName}</span>
      </div>
    </div>
  );
};
