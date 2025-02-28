'use client';
import {JSX, useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import LocationNode from "./LocationNode";
import LocationPage from "./LocationPage"
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";


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

//Associates name with gps location
const locations = [
    { name: "Boston Common", coordinates: [42.35532, -71.063639] },
    { name: "Massachusetts State House", coordinates: [42.35770, -71.06350] },
    { name: "Park Street Church", coordinates: [42.35666, -71.06183] },
    { name: "Granary Burying Ground", coordinates: [42.35719, -71.06125] },
    { name: "King's Chapel & King's Chapel Burying Ground", coordinates: [42.35831, -71.06000] },
    { name: "Boston Latin School Site/Benjamin Franklin Statue", coordinates: [42.35784, -71.05977] },
    { name: "Old Corner Bookstore", coordinates: [42.35745, -71.05835] },
    { name: "Old South Meeting House", coordinates: [42.35703, -71.05855] },
    { name: "Old State House", coordinates: [42.35858, -71.05750] },
    { name: "Boston Massacre Site", coordinates: [42.35858, -71.05728] },
    { name: "Faneuil Hall", coordinates: [42.36002, -71.05595] },
    { name: "Paul Revere House", coordinates: [42.36372, -71.05355] },
    { name: "Old North Church", coordinates: [42.36637, -71.05460] },
    { name: "USS Constitution", coordinates: [42.37290, -71.05740] },
    { name: "Bunker Hill Monument", coordinates: [42.37620, -71.06075] },
    { name: "Copp's Hill Burying Ground", coordinates: [42.36694, -71.05615] },

];

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

    //this is a transparent (ish) map.
    // L.tileLayer('https://{s}.tile.toner-transparent.com/{z}/{x}/{y}.png', { // Use transparent tiles
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>', // Add appropriate attribution
    // }).addTo(map);


    locations.forEach(({ name, coordinates }) => {
      const myIcon = L.divIcon({
        html: ReactDOMServer.renderToString(<LocationNode />),
        className: "custom-icon",
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [-16, 0],
      });

      //Plot marker
      const marker = L.marker([coordinates[0], coordinates[1]] as [number, number], {
        icon: myIcon,
        interactive: true,
      }).addTo(map);

      //Add popup
      marker.bindPopup(() => {
        const container = document.createElement("div");

        //Styling for outer container.
        container.className = "bg-white flex justify-center rounded-2xl p-1 w-[300px] max-w-[90vw]";
        const root = ReactDOM.createRoot(container);
        root.render(<LocationPage locationName={name} />); //Pass name

        setTimeout(() => {
          const popupWrapper = container.closest('.leaflet-popup-content-wrapper'); //Located in PopupStyles.module.css
          if (popupWrapper) {
            //Border Styling
            popupWrapper.classList.add("border-4", "border-[#0a2463]", "rounded-2xl");
          }
        }, 0);

        return container;
      });
    });


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
