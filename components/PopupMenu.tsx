"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PopupMenuProps {
  isOpen: boolean;
  onClose: () => void; // Add function to close the menu
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-4 z-50">
      <div className="bg-white w-80 sm:w-96 rounded-lg shadow-2xl overflow-hidden border border-gray-300">
        <div className="p-0 text-gray-900">
          {/* Toggle Tracking Button
          <button
            onClick={() => {
              onClose(); // Close menu when clicked
            }}
            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded transition"
          >
            <h3 className="text-lg font-bold text-blue-900">Start Tracking</h3>
            <p className="text-sm opacity-80">Track your tour on the trail</p>
          </button> */}

          {/* Register Business Button (Navigates & Closes Menu) */}
          <button
            onClick={() => {
              router.push("/business-account");
              onClose(); // Close menu after navigating
            }}
            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded transition"
          >
            <h3 className="text-lg font-bold text-blue-900">Register Business</h3>
            <p className="text-sm opacity-80">Register a business to add to the map</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupMenu;
