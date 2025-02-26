'use client';
import {JSX, useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { FeatureCollection } from 'geojson';
import LocationNode from "./LocationNode";
import LocationPage from "./LocationPage"
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import styles from "../PopupStyles.module.css";

const locations = [
  { name: "Boston Common", coordinates: [42.3554693, -71.0663677] },
  { name: "Massachusetts State House", coordinates: [42.3601, -71.0589] },
  { name: "Park Street Church", coordinates: [42.3604, -71.0583] },
  { name: "Granary Burying Ground", coordinates: [42.3600, -71.0620] },
  { name: "King's Chapel & King's Chapel Burying Ground", coordinates: [42.3588, -71.0616] },
  { name: "Boston Latin School Site/Benjamin Franklin Statue", coordinates: [42.3611, -71.0656] },
  { name: "Old Corner Bookstore", coordinates: [42.3608, -71.0581] },
  { name: "Old South Meeting House", coordinates: [42.3571312, -71.0587301] },
  { name: "Old State House", coordinates: [42.3603, -71.0577] },
  { name: "Boston Massacre Site", coordinates: [42.3600, -71.0574] },
  { name: "Paul Revere House", coordinates: [42.3634, -71.0549] },
  { name: "Old North Church", coordinates: [42.3645, -71.0544] },
  { name: "USS Constitution", coordinates: [42.3754, -71.0291] },
  { name: "Faneuil Hall", coordinates: [42.3601, -71.0572] },
  { name: "Bunker Hill", coordinates: [42.3605, -71.0579] },
  { name: "Park Street Church", coordinates: [42.3605, -71.0579] },

];



// define the icon options *outside* the component so they don't get mad
const iconOptions: L.IconOptions = {
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 62]
};


interface MapProps {
  geoJsonData: FeatureCollection | null;
}

const FreedomMap: ({geoJsonData}: { geoJsonData: any }) => JSX.Element = ({ geoJsonData }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!geoJsonData || mapRef.current || typeof window === 'undefined') return;

    // set map to fill screen
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.height = '100vh';
      mapContainer.style.width = '100vw';
    }

    const map = L.map('map', {
      center: [42.2626, -71.8023],
      zoom: 13,
    });

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    overlay.style.zIndex = '100';
    mapContainer?.appendChild(overlay);

    //this is a regular street view map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
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
      });

      const marker = L.marker(coordinates, {
        icon: myIcon,
        interactive: true,
      }).addTo(map);

      marker.bindPopup(() => {
        const container = document.createElement("div");

        // Add Tailwind classes for the outer popup container
        container.className = "bg-white flex justify-center rounded-2xl p-1 w-[300px] max-w-[90vw]";

        // Render the LocationPage with the corresponding location name dynamically
        const root = ReactDOM.createRoot(container);
        root.render(<LocationPage locationName={name} />);  {/* Dynamic location name */}

        setTimeout(() => {
          const popupWrapper = container.closest('.leaflet-popup-content-wrapper');
          if (popupWrapper) {
            popupWrapper.classList.add("border-4", "border-[#0a2463]", "rounded-2xl");
          }
        }, 0);

        return container;
      });
    });

    const customIcon = L.icon(iconOptions);

    L.geoJSON(geoJsonData, {
      style: () => ({
        color: "#D00000",
        weight: 6,
      }),
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {icon: customIcon});
      }
    }).addTo(map);



    const bounds = L.geoJSON(geoJsonData).getBounds();
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
  }, [geoJsonData]);

  return <div id="map" style={{}}></div>;
};

export default FreedomMap;