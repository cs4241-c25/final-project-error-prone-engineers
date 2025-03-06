'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FeatureCollection } from 'geojson';
import Banner from '../components/Banner';
import { useSession } from "next-auth/react";

// Dynamic import for the map
const DynamicFreedomMap = dynamic(() => import('../components/FreedomMap'), {
  ssr: false,
});

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [geoJsonDataRestrooms, setGeoJsonDataRestrooms] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tracking state lifted to Home
  const [trackingData, setTrackingData] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  // Check session for login state
  const { data: session } = useSession();
  if (session) {
    console.log("Logged in as: " + session.user?.name);
  } else {
    console.log("User not logged in");
  }

  useEffect(() => {
    fetch('/freedom_path.geojson')
        .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
        .then((data: FeatureCollection) => setGeoJsonData(data))
        .catch(err => {
          console.error("Error loading GeoJSON:", err);
          setError(err.message);
        });

    fetch('/restrooms.geojson')
        .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
        .then((data: FeatureCollection) => setGeoJsonDataRestrooms(data))
        .catch(err => {
          console.error("Error loading GeoJSON restrooms:", err);
          setError(err.message);
        });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!geoJsonData) {
    return <div>Loading map...</div>;
  }

  return (
      <div className='flex flex-col h-screen overflow-hidden sm:h-screen sm:overflow-hidden'>
        <Banner setTrackingData={setTrackingData} setIsTracking={setIsTracking} isTracking={isTracking} />
        <DynamicFreedomMap
            geoJsonData={geoJsonData}
            geoJsonDataRestrooms={geoJsonDataRestrooms}
            trackingData={trackingData}
            isTracking={isTracking}
        />
      </div>
  );
}
