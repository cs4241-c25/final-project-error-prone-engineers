import { useState } from "react";
import LocationPage from "./LocationPage";

const LocationNode = () => {
    const [isOpen, setIsOpen] = useState(false);
//bg-gradient-to-r from-red-500 to-yellow-300 hover:from-red-600 hover:to-yellow-200
// bg-gradient-to-rfrom-blue-950 to-blue-400 hover:from-blue-800 hover:to-blue-50

    return (
        <div style={{ pointerEvents: "auto" }}>
            <button

                onClick={() => setIsOpen(true)}
                className="shadow-md bg-gradient-to-r from-blue-950 to-blue-400 hover:from-blue-800 hover:to-blue-50 text-white font-bold py-3 px-3 rounded-full shadow-md transition-all duration-300">
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