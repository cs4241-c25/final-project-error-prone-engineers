import { useState } from "react";
import LocationPage from "./LocationPage";

const LocationNode = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex justify-center items-center min-h-screen">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg">

            </button>


            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center border-[#0a2463] bg-black bg-opacity-50">


                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                    >X
                    </button>

                    <LocationPage />

                </div>
            )}
        </div>
    );
};

export default LocationNode;