'use client';
import { useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import Map from '../components/FreedomMap';
import Menu from '../components/HamburgerMenu';
import LoginButton from '../components/LoginButton';
import LocationNode from '../components/LocationNode';
import Head from 'next/head';

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className='flex flex-row h-1/6 z-100 bg-[#D00000] text-center items-center p-2'>
        <div className="flex-shrink-0">
          <Menu/>
        </div>
        <h1 className='font-extrabold text-5xl font-cinzel mx-auto'>Boston Freedom Trail</h1>
        <div className='flex-grow-0'>
          <LoginButton/>
        </div>
        <div className='flex-grow-0'>
          <LocationNode/>
        </div>
      </div>
      <Map geoJsonData={geoJsonData}/>
    </div>
  );
}
