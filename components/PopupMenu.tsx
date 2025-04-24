"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PopupMenuProps {
    isOpen: boolean;
    onClose: () => void;
    setTrackingData: (data: string | null) => void;
    setIsTracking: React.Dispatch<React.SetStateAction<boolean>>;
    isTracking?: boolean;
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isOpen, onClose, setTrackingData, setIsTracking, isTracking = false }) => {
    const router = useRouter();
    const [localTrackingState, setLocalTrackingState] = useState(isTracking);
    const { data: session } = useSession();

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

    // Sync local state with the parent prop when it changes
    useEffect(() => {
        setLocalTrackingState(isTracking);
    }, [isTracking]);

    if (!isOpen) return null;

    const handleToggleTracking = () => {
        setLocalTrackingState((prevState) => !prevState); // Update local state immediately
        setIsTracking((prevState) => {
            const newTrackingState = !prevState;
            setTrackingData(newTrackingState ? "User Started Tracking" : "User Stopped Tracking");
            return newTrackingState;
        });

        onClose();
    };


    return (
        <div className="fixed top-20 left-4 z-50">
            <div className="bg-white w-80 mt-10 sm:w-96 rounded-lg shadow-2xl overflow-hidden border border-gray-300">
                <div className="p-0 text-gray-900">

                    {/* Toggle Tracking Button */}
                    <button
                        onClick={handleToggleTracking}
                        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <h3 className="text-xl font-extrabold text-blue-900 font-garamond">
                            {localTrackingState ? "Stop Tracking" : "Start Tracking"}
                        </h3>
                        <p className="text-md font-bold opacity-80 font-garamond">
                            {localTrackingState ? "Stop tracking your tour" : "Track your tour on the trail"}
                        </p>
                    </button>

                    {session?.user?.role === "user" && (
                        <>
                            <hr className="border-gray-300" />

                            <button
                                onClick={() => {
                                    router.push("/business-request");
                                    onClose();
                                }}
                                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                <h3 className="text-xl font-extrabold text-blue-900 font-garamond">
                                    Request to be a Business Owner
                                </h3>
                                <p className="text-md font-bold opacity-80 font-garamond">
                                    Request for this account to be a business Owner
                                </p>
                            </button>
                        </>
                    )}

                    {(session?.user?.role === "admin" || session?.user?.role === "business_owner") && (
                        <>
                        {/* Divider Line */}
                        <hr className="border-gray-300" />

                        {/* Register Business Button */}
                        <button
                            onClick={() => {
                                router.push("/business-account");
                                onClose();
                            }}
                            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <h3 className="text-xl font-extrabold text-blue-900 font-garamond">Register Business</h3>
                            <p className="text-md font-bold opacity-80 font-garamond">Register a business to add to the map</p>
                        </button>
                        </>
                    )}

                    {session?.user?.role === "admin" && (
                        <>
                            <hr className="border-gray-300" />

                            <button
                                onClick={() => {
                                    router.push("/admin");
                                    onClose();
                                }}
                                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                <h3 className="text-xl font-extrabold text-blue-900 font-garamond">
                                    Accept Business Owners
                                </h3>
                                <p className="text-md font-bold opacity-80 font-garamond">
                                    Add a user as a business Owner
                                </p>
                            </button>
                        </>
                    )}


                </div>
            </div>
        </div>
    );
};

export default PopupMenu;
