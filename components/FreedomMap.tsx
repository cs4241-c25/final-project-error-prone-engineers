'use client';
import {JSX, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import LocationNode from "./LocationNode";
import LocationPage from "./LocationPage"
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import Image from "next/image";


import {createBadgeObject, getBadges} from "@/lib/badges";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {NextResponse} from "next/server";
import {useSession} from "next-auth/react";

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
      <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="27" height="27" fill="white"/>
        <path d="M23.6318 0.386846C23.6318 0.386846 3.04932 0.380518 3.05522 0.386846C1.15805 0.386846 0.0915527 1.36771 0.0915527 3.37119V24.0287C0.0915527 25.9031 1.05047 26.8844 2.94596 26.8844H23.6908C25.5863 26.8844 26.5465 25.952 26.5465 24.0287V3.37119C26.5469 1.41622 25.5867 0.386846 23.6318 0.386846ZM19.0861 3.48256C19.3002 3.47919 19.5129 3.51846 19.7117 3.59809C19.9105 3.67772 20.0914 3.79611 20.244 3.94638C20.3966 4.09664 20.5178 4.27578 20.6005 4.47333C20.6831 4.67089 20.7257 4.88293 20.7256 5.09709C20.7255 5.31125 20.6828 5.52325 20.6 5.72075C20.5172 5.91824 20.3958 6.09728 20.2431 6.24742C20.0904 6.39757 19.9094 6.51582 19.7105 6.5953C19.5116 6.67477 19.2989 6.71388 19.0848 6.71033C18.6613 6.70332 18.2575 6.53012 17.9605 6.22808C17.6636 5.92605 17.4972 5.51939 17.4974 5.09582C17.4976 4.67226 17.6642 4.26573 17.9614 3.96393C18.2586 3.66213 18.6625 3.48924 19.0861 3.48256ZM7.50854 3.58677C7.72267 3.58333 7.93535 3.62255 8.13418 3.70212C8.333 3.7817 8.51401 3.90005 8.66664 4.05028C8.81928 4.2005 8.94049 4.3796 9.02322 4.57714C9.10595 4.77468 9.14854 4.9867 9.14851 5.20086C9.14849 5.41503 9.10584 5.62704 9.02306 5.82456C8.94028 6.02207 8.81902 6.20114 8.66634 6.35133C8.51367 6.50151 8.33263 6.61981 8.13378 6.69934C7.93494 6.77887 7.72225 6.81802 7.50812 6.81453C7.08461 6.80763 6.68078 6.63453 6.38375 6.33258C6.08671 6.03062 5.92027 5.62401 5.92033 5.20044C5.92038 4.77688 6.08693 4.37031 6.38404 4.06843C6.68116 3.76655 7.08503 3.59356 7.50854 3.58677ZM11.3231 14.5192C11.3188 14.6915 11.2473 14.8553 11.1239 14.9756C11.0005 15.0959 10.835 15.1632 10.6627 15.1632C10.4904 15.1632 10.3249 15.0959 10.2015 14.9756C10.0781 14.8553 10.0066 14.6915 10.0022 14.5192V9.89464H9.55969V15.1799H9.55716V22.6483C9.55716 22.764 9.53439 22.8785 9.49014 22.9853C9.44589 23.0921 9.38104 23.1892 9.29928 23.2709C9.21753 23.3527 9.12047 23.4175 9.01364 23.4618C8.90682 23.506 8.79233 23.5288 8.67671 23.5288C8.56109 23.5288 8.4466 23.506 8.33977 23.4618C8.23295 23.4175 8.13589 23.3527 8.05414 23.2709C7.97238 23.1892 7.90752 23.0921 7.86328 22.9853C7.81903 22.8785 7.79626 22.764 7.79626 22.6483V15.1799H7.21533V22.6483C7.21533 22.8819 7.12257 23.1058 6.95746 23.2709C6.79234 23.436 6.56839 23.5288 6.33488 23.5288C6.10137 23.5288 5.87742 23.436 5.71231 23.2709C5.54719 23.1058 5.45443 22.8819 5.45443 22.6483V15.1799H5.45105V9.89464H5.00808V14.5192C5.00808 14.6944 4.9385 14.8624 4.81464 14.9862C4.69079 15.1101 4.5228 15.1797 4.34764 15.1797C4.17248 15.1797 4.00449 15.1101 3.88063 14.9862C3.75678 14.8624 3.68719 14.6944 3.68719 14.5192V9.82503C3.68719 9.80535 3.68804 9.7865 3.68972 9.7685V8.95344C3.68967 8.74949 3.7298 8.54753 3.80782 8.3591C3.88584 8.17066 4.00023 7.99945 4.14444 7.85523C4.28865 7.71102 4.45987 7.59664 4.6483 7.51861C4.83674 7.44059 5.0387 7.40046 5.24265 7.40052H9.76641C9.97036 7.40046 10.1723 7.44059 10.3608 7.51861C10.5492 7.59664 10.7204 7.71102 10.8646 7.85523C11.0088 7.99945 11.1232 8.17066 11.2012 8.3591C11.2793 8.54753 11.3194 8.74949 11.3193 8.95344V9.7685C11.321 9.78706 11.3219 9.80591 11.3219 9.82503V14.5192H11.3231ZM13.7485 23.4229H12.6098V3.51674H13.7485V23.4229ZM23.1436 14.4762C22.9746 14.5213 22.7945 14.4975 22.643 14.4101C22.4915 14.3226 22.3808 14.1786 22.3353 14.0096L21.198 9.7917H20.7204L22.7551 17.423H20.8465V22.6918C20.8465 22.8864 20.7692 23.0731 20.6316 23.2107C20.494 23.3483 20.3073 23.4257 20.1127 23.4257C19.9181 23.4257 19.7314 23.3483 19.5938 23.2107C19.4562 23.0731 19.3788 22.8864 19.3788 22.6918V17.4234H18.7954V22.6918C18.7954 22.8864 18.7181 23.073 18.5805 23.2106C18.4429 23.3481 18.2563 23.4254 18.0617 23.4254C17.8672 23.4254 17.6806 23.3481 17.543 23.2106C17.4054 23.073 17.3281 22.8864 17.3281 22.6918V17.4234H15.4183L17.4458 9.7917H16.9805L15.8634 14.0096C15.8141 14.1742 15.7026 14.313 15.5526 14.3967C15.4026 14.4804 15.2259 14.5024 15.0599 14.4579C14.894 14.4134 14.752 14.306 14.6639 14.1585C14.5759 14.011 14.5488 13.835 14.5884 13.6679L16.0106 8.29869C16.0176 8.27338 16.0259 8.24877 16.0355 8.22486C16.107 7.95761 16.2646 7.7214 16.484 7.55284C16.7033 7.38428 16.9721 7.29278 17.2488 7.29252H20.9128C21.1779 7.29271 21.4361 7.37669 21.6506 7.53247C21.8651 7.68826 22.0249 7.90786 22.1071 8.15989C22.1302 8.2032 22.1487 8.24933 22.1628 8.29827L23.6107 13.6679C23.6558 13.8369 23.632 14.017 23.5445 14.1685C23.457 14.3201 23.3126 14.4307 23.1436 14.4762Z" fill="#0A2463"/>
      </svg>    
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const locationIcon = L.divIcon({
  className: "custom-restroom-icon",
  html: `
    <div style="width: 32px; height: 32px;">
      <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="38" height="38" rx="19" fill="white"/>
        <rect x="1.5" y="1.5" width="38" height="38" rx="19" stroke="#D00000" stroke-width="3"/>
        <path d="M23.5917 17.5833H30.7083V14.9583H25.4292L22.5125 10.1021C22.075 9.37292 21.2875 8.87709 20.3833 8.87709C20.1208 8.87709 19.8875 8.92084 19.6542 8.99376L11.75 11.4583V19.0417H14.375V13.6896L17.4521 12.7271L11.75 35.0833H14.375L18.5604 23.2563L21.9583 27.7917V35.0833H24.5833V25.7354L20.9521 19.1146L22.0167 14.9292M23.4167 8.54167C24.875 8.54167 26.0417 7.37501 26.0417 5.91667C26.0417 4.45834 24.875 3.29167 23.4167 3.29167C21.9583 3.29167 20.7917 4.45834 20.7917 5.91667C20.7917 7.37501 21.9583 8.54167 23.4167 8.54167Z" fill="#D00000"/>
      </svg>
    </div>`,
  iconSize: [35, 35],
  iconAnchor: [16, 35],
  popupAnchor: [0, -35],
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

interface MapProps {
  geoJsonData: FeatureCollection | null;
  geoJsonDataRestrooms: FeatureCollection | null;
  trackingData: string | null;
  isTracking: boolean;
}


const FreedomMap: React.FC<MapProps> = ({ geoJsonData, geoJsonDataRestrooms, trackingData, isTracking }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { data: session } = useSession();


  useEffect(() => {
    if (!geoJsonData || !geoJsonDataRestrooms || mapRef.current || typeof window === "undefined") return;

    // Set map to fill screen
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      // mapContainer.style.height = "100vh";
      mapContainer.style.width = "100vw";
    }

    const map = L.map("map", {
      center: [42.2626, -71.8023],
      zoom: 13,
    });

    // const overlay = document.createElement("div");
    // overlay.style.position = "absolute";
    // overlay.style.top = "0";
    // overlay.style.left = "0";
    // overlay.style.width = "100%";
    // overlay.style.height = "100%";
    // overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    // overlay.style.zIndex = "100";
    // mapContainer?.appendChild(overlay);

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
        html: ReactDOMServer.renderToString(
            <Image
                src={"/freedom_trail.png"}
                alt={"Trail marker"}
                width={100}
                height={100}
                className="rounded-md object-cover w-full h-full hover:scale-110 hover:cursor-pointer transition-transform duration-200 ease-in-out shadow-md"
                loading="lazy"
            />
        ),
        className: "shadow-md",
        iconSize: [30, 30],
        iconAnchor: [25, 25],
        popupAnchor: [-16, 0],
      });

      // Plot marker
      const marker = L.marker([coordinates[0], coordinates[1]] as [number, number], {
        icon: myIcon,
        interactive: true,
      }).addTo(map);

      // Create Popup Content
      const container = document.createElement("div");
      container.className =
          "bg-white flex flex-col justify-start rounded-2xl p-2 w-[375px] max-w-[80vw] h-[60vh] max-h-[500px] overflow-y-auto";

      const root = ReactDOM.createRoot(container);
      root.render(<LocationPage locationName={name} />);

      // Bind Popup with Scrollable Content
      marker.bindPopup(container);

      // Adjust Popup Position & Styling
      marker.on("popupopen", () => {
        setTimeout(() => {
          const latLng = marker.getLatLng();
          const zoom = map.getZoom();
          const mapHeight = map.getSize().y;

          // Adjust offset for mobile devices
          const isMobile = window.innerWidth < 768;
          const pixelOffset = isMobile ? mapHeight * 0.3 : mapHeight * 0.4;

          const latLngOffset = map.containerPointToLatLng(
              map.latLngToContainerPoint(latLng).subtract([0, pixelOffset])
          );
          map.setView(latLngOffset, zoom, { animate: true });

          // Add border styling to the popup
          const popupWrapper = container.closest(".leaflet-popup-content-wrapper");
          if (popupWrapper) {
            popupWrapper.classList.add(
                "border-4",
                "border-[#0a2463]",
                "rounded-2xl",
                "max-w-[90vw]",
                "w-[425px]"
            );
          }
          //Hides popup tip
          const popupTip = document.querySelector(".leaflet-popup-tip");
          if (popupTip) {
            popupTip.classList.add("hidden");
          }

        }, 0);
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

  useEffect(() => {
    if (!isTracking || !mapRef.current) return;

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const watchPosition = navigator.geolocation.watchPosition(
      (position) => {
        if (!mapRef.current) return;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // const newPosition = new L.LatLng(lat, lng);
        let newPosition = new L.LatLng(lat, lng);

        if (!markerRef.current) {
          markerRef.current = L.marker(newPosition, { icon: locationIcon }).addTo(
            mapRef.current
          );
        } else {
          // update curr position
          markerRef.current.setLatLng(newPosition);
        }

        mapRef.current.setView(newPosition, 15);
        setUserPosition(newPosition);


        //for testing reasons
        // const testLat = 42.35532;  // Boston Common latitude
        // const testLng = -71.063639; // Boston Common longitude
        // newPosition = new L.LatLng(testLat, testLng);
        // getBadges()


        if (session) {
          locations.forEach(({ name, coordinates }) => {
            const locationPoint = new L.LatLng(coordinates[0], coordinates[1]);
            const distance = newPosition.distanceTo(locationPoint);

            if (distance < 9.14) {
              createBadgeObject(name);
            }
          });
        }

      },
      (error) => {
        console.error('Error getting location:', error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => {
      if (watchPosition) {
        navigator.geolocation.clearWatch(watchPosition);
      }
      // remove marker when tracking stops
      if (markerRef.current && mapRef.current){
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [isTracking]);

  const checkProgress = () => {
    if (!geoJsonData || !userPosition) return;

    const geometry = geoJsonData.features[0]?.geometry;
    if (!geometry) return;

    if (geometry.type === "LineString" || geometry.type === "Polygon") {
      const pathCoords = geometry.coordinates as [number, number][];
      if (!pathCoords) return;

      let closestPoint = null;
      let minDistance = Infinity;

      pathCoords.forEach(([lng, lat]) => {
        const pathPoint = new L.LatLng(lat, lng);
        const distance = userPosition.distanceTo(pathPoint);

        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = pathPoint;
        }
      });

      if (minDistance < 50) {
        console.log("User is near the path!");
      }
    } else if (geometry.type === "Point") {
        const pointCoords = geometry.coordinates as [number,number];
        const pointLatLng = new L.LatLng(pointCoords[1], pointCoords[0]);
        const distance = userPosition.distanceTo(pointLatLng);
        if(distance < 50){
            console.log("user is near the point");
        }
    } else {
      console.warn("Unsupported geometry type for progress check.");
    }
  };

  useEffect(() => {
    if (isTracking) {
      checkProgress();
    } else {
      // i want to return to the geojson path
      if (geoJsonData && mapRef.current) {
        const pathBounds = L.geoJSON(geoJsonData).getBounds();
        mapRef.current.fitBounds(pathBounds);
      }
    }
  }, [userPosition, isTracking]);

  return (
    <div className="flex flex-col h-screen">
      <div id="map" className="flex-grow relative z-20" style={{}}></div>
    </div>
  );
  // return <div id="map" style={{}}></div>;
};

export default FreedomMap;
