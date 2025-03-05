import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const splitStringAtNearestSpace = (str: string, split: boolean) => {
    if(!split) {
        return [str];
    }
    const middle = Math.floor(str.length / 2);
    let splitIndex = str.lastIndexOf(" ", middle);
    if (splitIndex === -1) splitIndex = middle;

    return [str.slice(0, splitIndex), str.slice(splitIndex + 1)];
};

async function getNodeInformation(nodeName: string): Promise<{ name: string; description: string } | null> {
    try {
        // Make sure the endpoint matches your route structure
        const response = await axios.get(`/api/nodes?name=${encodeURIComponent(nodeName)}`);
        return response.data; // Ensure this matches the expected shape { name: string; description: string }
    } catch (error: any) {
        console.error("Error fetching node:", error.response?.data || error.message);
        return null; // Return null in case of an error
    }
}

// Map node names to image paths
const nodeImageMap: Record<string, string> = {
    "Boston Common": "/location_images/Boston Common.jpg",
    "Massachusetts State House": "/location_images/Massachusetts State House.jpg",
    "Park Street Church": "/location_images/Park Street Church.jpg",
    "Granary Burying Ground": "/location_images/Granary Burying Ground.jpg",
    "King's Chapel & King's Chapel Burying Ground": "/location_images/King's Chapel.jpg",
    "Boston Latin School Site/Benjamin Franklin Statue": "/location_images/Statue of Benjamin Franklin.jpg",
    "Old Corner Bookstore": "/location_images/Old Corner Bookstore.jpg",
    "Old South Meeting House": "/location_images/Old South Meeting House.jpg",
    "Old State House": "/location_images/Old State House.jpg",
    "Boston Massacre Site": "/location_images/Boston Massacre Site.jpg",
    "Paul Revere House": "/location_images/Paul Revere House.jpg",
    "Old North Church": "/location_images/Old North Church.jpg",
    "USS Constitution": "/location_images/USS Constitution.jpg",
    "Faneuil Hall": "/location_images/Faneuil Hall.jpg",
    "Bunker Hill Monument": "/location_images/Bunker Hill-Monument.jpg",
    "Copp's Hill Burying Ground": "/location_images/Copp's Hill Burying Ground.jpg"
};

const LocationPage = ({ locationName }: { locationName: string }) => {
    const [nodeInfo, setNodeInfo] = useState<{ name: string; description: string } | null>(null);
    const [error, setError] = useState("");
    const [split, setSplit] = useState(false);

    useEffect(() => {
        async function fetchNodeData() {
            const data = await getNodeInformation(locationName);
            console.log("Fetched Node Data:", data);
            if (data === null) {
                setError("Failed to fetch node information.");
            } else {
                setNodeInfo(data);
            }
        }
        fetchNodeData();


        //decide whether to split the string
        const handleResize = () => {
            setSplit(window.innerWidth >= 640);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [locationName]);

    const imageSrc = nodeInfo ? nodeImageMap[nodeInfo.name] || "/location_images/Boston Common.jpg" : "";

    return (
        <div className="max-h-[80vh] max-w-[90vh]" style={{ zIndex: 200 }}>
            {error ? (
                <p className="text-red-500 flex justify-center">{error}</p>
            ) : nodeInfo ? (
                <div className="w-full">
                    <div className="bg-[#0a2463] rounded-md text-center">
                        <h1 className="text-3xl p-1 font-cinzel font-bold flex justify-center text-white mb-2">
                            {nodeInfo.name}
                        </h1>
                    </div>
                    <Image
                        src={imageSrc}
                        alt={nodeInfo.name}
                        width={1000}
                        height={1000}
                        className="rounded-md flex justify-center object-cover w-full h-full"
                        loading="lazy" // Lazy load for better performance
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {nodeInfo.description ? (
                            splitStringAtNearestSpace(nodeInfo.description, split).map((part, index) => (
                                <p key={index} className="text-black">
                                    {part}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-700 text-center">No description available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-black text-center">Loading...</p>
            )}
        </div>
    );
};

export default LocationPage;