'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { FeatureCollection } from 'geojson';

export default function Home() {
  const mapRef = useRef<L.Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/freedom_path.geojson') // Fetch from the public directory
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); // Proper error handling
        }
        return res.json();
      })
      .then((data: FeatureCollection) => {
        setGeoJsonData(data);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
        setError(err.message); // Set error message for display
      });

  }, []); // Empty dependency array ensures this runs only once


  useEffect(() => {
    if (!geoJsonData || mapRef.current) return; // Wait for data and map initialization

    const map = L.map('map', {
      center: [42.2626, -71.8023],
      zoom: 13,
    });

    // ... (icon setup)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.geoJSON(geoJsonData).addTo(map);

    const bounds = L.geoJSON(geoJsonData).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    } else {
      console.warn("GeoJSON bounds are invalid. Check your GeoJSON data.");
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geoJsonData]); // Re-run effect when geoJsonData changes

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!geoJsonData) {
    return <div>Loading map...</div>; // Display loading message
  }

  return (
    <div id="map" style={{ height: '500px', width: '100%' }}></div>
  );
}