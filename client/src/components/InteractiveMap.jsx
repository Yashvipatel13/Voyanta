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

      // OpenStreetMap tiles (reliable, keyless, clear rendering)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Force recalculation of container size for crisp rendering
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
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
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
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

      // Custom Clean Blue Pin
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #2563EB;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
            border: 2px solid #ffffff;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14]
      });

      const popupContent = `
        <div style="font-family: inherit; min-width: 170px; color: #0f172a; padding: 2px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-bottom: 2px;">
            ${act.timeSlot || `Stop ${idx + 1}`}
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 3px; color: #0f172a;">
            ${act.title}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 ${act.location}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600;">
            <span style="color: #0f172a;">Est: ₹${act.estimatedCost || 0}</span>
            <span style="background: ${act.isOutdoor ? '#ecfdf5; color: #059669;' : '#eff6ff; color: #2563eb;'} padding: 2px 6px; border-radius: 4px; font-size: 10px;">
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
        color: '#2563EB',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 8'
      }).addTo(markersLayerRef.current);
    }
  }, [activities, center]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-card">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
      
      {/* Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        <span>Route Map: {destinationName}</span>
      </div>
    </div>
  );
};
