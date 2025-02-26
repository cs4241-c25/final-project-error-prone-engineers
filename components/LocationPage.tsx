import { useState, useEffect } from "react";
import { getNodeInformation } from "../app/api/get_nodes/route";
import Image from "next/image";

const splitStringAtNearestSpace = (str: string) => {
    const middle = Math.floor(str.length / 2);
    let splitIndex = str.lastIndexOf(" ", middle);
    if (splitIndex === -1) splitIndex = middle;

    return [str.slice(0, splitIndex), str.slice(splitIndex + 1)];
};

// Map node names to image paths
const nodeImageMap: Record<string, string> = {
    "Boston Common": "/location_images/BostonCommon.jpg",
    "Massachusetts State House": "/location_images/Massachusetts State House.jpg",
    "Park Street Church": "/location_images/Park Street Church.jpg",
    "Granary Burying Ground": "/location_images/Granary Burying Ground.jpg",
    "King's Chapel & King's Chapel Burying Ground": "/location_images/King's Chapel & King's Chapel Burying Ground.jpg",
    "Boston Latin School Site/Benjamin Franklin Statue": "/location_images/Boston Latin School Site/Benjamin Franklin Statue",
    "Old Corner Bookstore": "/location_images/Old Corner Bookstore.jpg",
    "Old South Meeting House": "/location_images/Old South Meeting House.jpg",
    "Old State House": "/location_images/Old State House.jpg",
    "Boston Massacre Site": "/location_images/Boston Massacre Site.jpg",
    "Paul Revere House": "/location_images/Old North Churc.jpg",
    "Old North Church": "/location_images/Old North Church",
    "USS Constitution": "/location_images/USS Constitution.jpg",
    "Faneuil Hall": "/location_images/Faneuil Hall.jpg"

};

const LocationPage = ({ locationName }: { locationName: string }) => {
    const [nodeInfo, setNodeInfo] = useState<{ name: string; description: string } | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchNodeData() {
            const data = await getNodeInformation(locationName);  {/* Use locationName as dynamic value */}
            console.log("Fetched Node Data:", data);
            if (data?.error) {
                setError(data.error);
            } else {
                setNodeInfo(data);
            }
        }
        fetchNodeData();
    }, [locationName]);  {/* Dependency array to refetch when locationName changes */}

    const imageSrc = nodeInfo ? nodeImageMap[nodeInfo.name] || "/location_images/default.jpg" : "";

    return (
        <div style={{zIndex: 200}} >
            {error ? (
                <p className="text-red-500 flex justify-center">{error}</p>
            ) : nodeInfo ? (
                <div className="w-full">
                    <div className="bg-[#0a2463] rounded-md text-center">
                        <h1 className="text-4xl font-cinzel font-bold flex justify-center text-white mb-4">
                            {nodeInfo.name}
                        </h1>
                    </div>
                    <Image
                        src={imageSrc}
                        alt={nodeInfo.name}
                        width={1000}
                        height={1000}
                        className="rounded-md flex justify-center object-fill"
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {nodeInfo.description ? (
                            splitStringAtNearestSpace(nodeInfo.description).map((part, index) => (
                                <p key={index} className="text-gray-700 text-center">
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