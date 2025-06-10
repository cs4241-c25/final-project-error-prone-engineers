'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { FeatureCollection } from 'geojson';
import Map from '../components/FreedomMap';
import { Node } from '@/types/BusinessAccount';
import Banner from '../components/Banner';
import Head from 'next/head';
import { useSession } from "next-auth/react";

const DynamicFreedomMap = dynamic(() => import('../components/FreedomMap'), {
    ssr: false,
});

interface PageProps {
  geoJsonData: FeatureCollection | null;
  geoJsonDataRestrooms: FeatureCollection | null;
  nodes: Node[];
}

export default function Home() {
    const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
    const [geoJsonDataRestrooms, setGeoJsonDataRestrooms] = useState<FeatureCollection | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);

    const { data: session } = useSession();
    if (session) {
        console.log("Logged in as: " + session.user?.name);
    } else {
        console.log("User not logged in");
    }

    const [trackingData, setTrackingData] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState<boolean>(false);

    // Restore saved tracking state from sessionStorage
    useEffect(() => {
        const savedTracking = sessionStorage.getItem('isTracking');
        const savedData = sessionStorage.getItem('trackingData');

        if (savedTracking === 'true') {
            setIsTracking(true);
        }
        if (savedData) {
            setTrackingData(savedData);
        }
    }, []);

    // Save tracking state to sessionStorage when it changes
    useEffect(() => {
        sessionStorage.setItem('isTracking', isTracking.toString());
    }, [isTracking]);

    useEffect(() => {
        if (trackingData !== null) {
            sessionStorage.setItem('trackingData', trackingData);
        }
    }, [trackingData]);

    // Load business nodes
    useEffect(() => {
        async function fetchNodes() {
            const response = await axios.get('/api/nodes');
            const nodes: Node[] = response.data;
            console.log(nodes);
            setNodes(nodes);
        }
        fetchNodes().then();
    }, []);

    // Load geojson data
    useEffect(() => {
        fetch('/freedom_path.geojson')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data: FeatureCollection) => {
                setGeoJsonData(data);
            })
            .catch(err => {
                console.error("Error loading GeoJSON:", err);
                setError(err.message);
            });

        fetch('/restrooms.geojson')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data: FeatureCollection) => {
                setGeoJsonDataRestrooms(data);
            })
            .catch(err => {
                console.error("Error loading GeoJSON restrooms:", err);
                setError(err.message);
            });
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!geoJsonData) return <div>Loading map...</div>;

    return (
        <div className="flex flex-col min-h-[100dvh] overflow-hidden">
            <Banner
                setTrackingData={setTrackingData}
                setIsTracking={setIsTracking}
                isTracking={isTracking}
            />
            <DynamicFreedomMap
                geoJsonData={geoJsonData}
                geoJsonDataRestrooms={geoJsonDataRestrooms}
                trackingData={trackingData}
                isTracking={isTracking}
                nodes={nodes}
            />
        </div>
    );
}
