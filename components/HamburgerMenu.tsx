"use client";
import { useState } from "react";
import PopupMenu from "@/components/PopupMenu";

interface HamburgerMenuProps {
    setTrackingData: (data: string | null) => void;
    setIsTracking: React.Dispatch<React.SetStateAction<boolean>>;
    isTracking: boolean;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ setTrackingData, setIsTracking, isTracking }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="relative z-50">
            <button onClick={toggleMenu} className="p-2 hover:bg-red-500">
                <svg
                    className="w-8 h-8 md:w-18 md:h-18 lg:w-20 lg:h-20"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M13.3333 60C12.3889 60 11.5978 59.68 10.96 59.04C10.3222 58.4 10.0022 57.6089 10 56.6667C9.99779 55.7244 10.3178 54.9333 10.96 54.2933C11.6022 53.6533 12.3933 53.3333 13.3333 53.3333H66.6667C67.6111 53.3333 68.4033 53.6533 69.0433 54.2933C69.6833 54.9333 70.0022 55.7244 70 56.6667C69.9978 57.6089 69.6778 58.4011 69.04 59.0433C68.4022 59.6856 67.6111 60.0044 66.6667 60H13.3333ZM13.3333 43.3333C12.3889 43.3333 11.5978 43.0133 10.96 42.3733C10.3222 41.7333 10.0022 40.9422 10 40C9.99779 39.0578 10.3178 38.2667 10.96 37.6267C11.6022 36.9867 12.3933 36.6667 13.3333 36.6667H66.6667C67.6111 36.6667 68.4033 36.9867 69.0433 37.6267C69.6833 38.2667 70.0022 39.0578 70 40C69.9978 40.9422 69.6778 41.7344 69.04 42.3767C68.4022 43.0189 67.6111 43.3378 66.6667 43.3333H13.3333ZM13.3333 26.6667C12.3889 26.6667 11.5978 26.3467 10.96 25.7067C10.3222 25.0667 10.0022 24.2756 10 23.3333C9.99779 22.3911 10.3178 21.6 10.96 20.96C11.6022 20.32 12.3933 20 13.3333 20H66.6667C67.6111 20 68.4033 20.32 69.0433 20.96C69.6833 21.6 70.0022 22.3911 70 23.3333C69.9978 24.2756 69.6778 25.0678 69.04 25.71C68.4022 26.3522 67.6111 26.6711 66.6667 26.6667H13.3333Z"
                        fill="white"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50">
                    <PopupMenu
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        setTrackingData={setTrackingData}
                        setIsTracking={setIsTracking}
                        isTracking={isTracking}
                    />
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
