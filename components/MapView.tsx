
import React, { useEffect, useRef } from 'react';
import { RoutePoint } from '../types';

interface MapViewProps {
  points: RoutePoint[];
  className?: string;
  isInteractive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ points, className = "h-64", isInteractive = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    // Only load if L exists (added via CDN in index.html)
    const L = (window as any).L;
    if (!L || !mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      zoomControl: isInteractive,
      dragging: isInteractive,
      scrollWheelZoom: isInteractive,
      attributionControl: false,
    }).setView([-23.5505, -46.6333], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(leafletMap.current);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isInteractive]);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMap.current || points.length === 0) return;

    // Clear existing layers if any (except base)
    leafletMap.current.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        leafletMap.current.removeLayer(layer);
      }
    });

    const latLngs = points.map(p => [p.lat, p.lng]);
    const polyline = L.polyline(latLngs, { color: '#eab308', weight: 4 }).addTo(leafletMap.current);
    
    // Fit bounds
    leafletMap.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });

    // Markers for start and end
    L.circleMarker(latLngs[0], { radius: 5, color: '#eab308', fillOpacity: 1 }).addTo(leafletMap.current);
    if (latLngs.length > 1) {
      L.circleMarker(latLngs[latLngs.length - 1], { radius: 5, color: '#ef4444', fillOpacity: 1 }).addTo(leafletMap.current);
    }
  }, [points]);

  return (
    <div ref={mapRef} className={`rounded-xl overflow-hidden border border-zinc-800 ${className}`} />
  );
};
