import { useState } from "react";
import LocationPage from "./LocationPage";

const LocationNode = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ pointerEvents: "auto" }}>
            <button

                onClick={() => setIsOpen(true)}
                className="shadow-md bg-[#EFA906] text-white font-bold py-3 px-3 rounded-full shadow-lg">
            </button>


            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center border-[#0a2463] bg-black bg-opacity-50">
                    <div className="relative bg-white p-5 rounded-lg shadow-lg max-w-md w-full text-center">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                        >
                            X
                        </button>

                        <LocationPage locationName={"Boston Common"}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationNode;