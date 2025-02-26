"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FeatureCollection } from "geojson";

// Define absolute paths for Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/_next/static/images/marker-icon-2x.png",
  iconUrl: "/_next/static/images/marker-icon.png",
  shadowUrl: "/_next/static/images/marker-shadow.png",
});

const restroomIcon = L.divIcon({
  className: "custom-restroom-icon",
  html: `
    <div style="width: 32px; height: 32px;">
      <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5626 10.7917C13.2655 10.7917 14.6459 9.41121 14.6459 7.70833C14.6459 6.00546 13.2655 4.625 11.5626 4.625C9.8597 4.625 8.47925 6.00546 8.47925 7.70833C8.47925 9.41121 9.8597 10.7917 11.5626 10.7917Z" fill="#0A2463" stroke="#0A2463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.4376 10.7917C27.1405 10.7917 28.5209 9.41121 28.5209 7.70833C28.5209 6.00546 27.1405 4.625 25.4376 4.625C23.7347 4.625 22.3542 6.00546 22.3542 7.70833C22.3542 9.41121 23.7347 10.7917 25.4376 10.7917Z" fill="#0A2463" stroke="#0A2463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.70837 15.4167H15.4167L13.875 32.375H9.25004L7.70837 15.4167ZM21.5834 15.4167H29.2917L30.8334 23.8958H28.5209L27.75 32.375H23.125L22.3542 23.8958H20.0417L21.5834 15.4167Z" fill="#0A2463" stroke="#0A2463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


interface MapProps {
  geoJsonData: FeatureCollection | null;
  geoJsonDataRestrooms: FeatureCollection | null;
}

const FreedomMap: React.FC<MapProps> = ({ geoJsonData, geoJsonDataRestrooms }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!geoJsonData || !geoJsonDataRestrooms || mapRef.current || typeof window === "undefined") return;

    // Set map to fill screen
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.style.height = "100vh";
      mapContainer.style.width = "100vw";
    }

    const map = L.map("map", {
      center: [42.2626, -71.8023],
      zoom: 13,
    });

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    overlay.style.zIndex = "100";
    mapContainer?.appendChild(overlay);

    // Load base map layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add GeoJSON data with markers
    const pathLayer = L.geoJSON(geoJsonData, {
      style: () => ({
        color: "#D00000",
        weight: 6,
      }),
      pointToLayer: (feature, latlng) => L.marker(latlng),
    }).addTo(map);

    const restroomLayer = L.geoJSON(geoJsonDataRestrooms, {
      style: () => ({
        color: "#0A2463",
        weight: 4,
      }),
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: restroomIcon }).bindPopup(
          feature.properties?.name || "Restroom"
        );
      },
    }).addTo(map);

    // Fit map to bounds
    const bounds = L.featureGroup([pathLayer, restroomLayer]).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    } else {
      console.warn("GeoJSON bounds are invalid. Check your GeoJSON data.");
    }

    mapRef.current = map;
    map.invalidateSize();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geoJsonData, geoJsonDataRestrooms]);

  return <div id="map" style={{}}></div>;
};

export default FreedomMap;
