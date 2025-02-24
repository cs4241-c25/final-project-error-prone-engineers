'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FeatureCollection } from 'geojson';
import Map from '../components/FreedomMap';
import Banner from '../components/Banner';
import Head from 'next/head';
import { useSession } from "next-auth/react";


//so the map has to be dynamic
//bc it can't render on server side, it can only render on client side
const DynamicFreedomMap = dynamic(() => import('../components/FreedomMap'), {
  ssr: false,
});
interface PageProps {
  geoJsonData: FeatureCollection | null;
}

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Testing code to ensure user logs in
  const { data: session } = useSession();
  if (session) {
    console.log("Logged in as: " + session.user?.name);
  } else {
    console.log("User not logged in");
  }

  useEffect(() => {
    fetch('/freedom_path.geojson')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: FeatureCollection) => {
        setGeoJsonData(data);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
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
    <div className='flex flex-col'>
      <Banner />
      <DynamicFreedomMap geoJsonData={geoJsonData} />
    </div>
  );
}
