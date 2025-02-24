'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { FeatureCollection } from 'geojson';

// define the icon options *outside* the component so they don't get mad
const iconOptions: L.IconOptions = {
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 62]
};


interface MapProps {
  geoJsonData: FeatureCollection | null;
}

const FreedomMap: React.FC<MapProps> = ({ geoJsonData }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!geoJsonData || mapRef.current || typeof window === 'undefined') return;

    // set map to fill screen
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.height = '100vh';
      mapContainer.style.width = '100vw';
    }

    const map = L.map('map', {
      center: [42.2626, -71.8023],
      zoom: 13,
    });

    //image is hard to look at but may add as like a landing screen sitch
    // const imageUrl = '/freedomtrail_medallion.jpg';  // Correct path from the public folder
    // const imageBounds: [L.LatLngTuple, L.LatLngTuple] = [
    //   [42.0, -72.0], // Bottom-left corner (lat, lon)
    //   [42.5, -71.5]  // Top-right corner (lat, lon)
    // ];

    // L.imageOverlay(imageUrl, imageBounds, {
    //   opacity: 0.7,
    // }).addTo(map);

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    overlay.style.zIndex = '100';
    mapContainer?.appendChild(overlay);

    //this is a regular street view map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    //this is a transparent (ish) map. 
    // L.tileLayer('https://{s}.tile.toner-transparent.com/{z}/{x}/{y}.png', { // Use transparent tiles
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>', // Add appropriate attribution
    // }).addTo(map);

    const customIcon = L.icon(iconOptions);

    L.geoJSON(geoJsonData, {
      style: () => ({
        color: "#D00000",
        weight: 6,
      }),
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {icon: customIcon});
      }
    }).addTo(map);

    const bounds = L.geoJSON(geoJsonData).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    } else {
      console.warn("GeoJSON bounds are invalid. Check your GeoJSON data.");
    }

    mapRef.current = map;

    map.invalidateSize();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geoJsonData]);

  return <div id="map" style={{}}></div>;
};

export default FreedomMap;