'use client';
import {useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';
import LocationPage from "./LocationPage"
import ReactDOMServer from "react-dom/server";
import { Node } from '@/types/BusinessAccount';
import ReactDOM from "react-dom/client";
import Image from "next/image";


import {createBadgeObject, getBadges} from "@/lib/badges";
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
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="27" height="27" fill="white"/>
        <path d="M23.6318 0.386846C23.6318 0.386846 3.04932 0.380518 3.05522 0.386846C1.15805 0.386846 0.0915527 1.36771 0.0915527 3.37119V24.0287C0.0915527 25.9031 1.05047 26.8844 2.94596 26.8844H23.6908C25.5863 26.8844 26.5465 25.952 26.5465 24.0287V3.37119C26.5469 1.41622 25.5867 0.386846 23.6318 0.386846ZM19.0861 3.48256C19.3002 3.47919 19.5129 3.51846 19.7117 3.59809C19.9105 3.67772 20.0914 3.79611 20.244 3.94638C20.3966 4.09664 20.5178 4.27578 20.6005 4.47333C20.6831 4.67089 20.7257 4.88293 20.7256 5.09709C20.7255 5.31125 20.6828 5.52325 20.6 5.72075C20.5172 5.91824 20.3958 6.09728 20.2431 6.24742C20.0904 6.39757 19.9094 6.51582 19.7105 6.5953C19.5116 6.67477 19.2989 6.71388 19.0848 6.71033C18.6613 6.70332 18.2575 6.53012 17.9605 6.22808C17.6636 5.92605 17.4972 5.51939 17.4974 5.09582C17.4976 4.67226 17.6642 4.26573 17.9614 3.96393C18.2586 3.66213 18.6625 3.48924 19.0861 3.48256ZM7.50854 3.58677C7.72267 3.58333 7.93535 3.62255 8.13418 3.70212C8.333 3.7817 8.51401 3.90005 8.66664 4.05028C8.81928 4.2005 8.94049 4.3796 9.02322 4.57714C9.10595 4.77468 9.14854 4.9867 9.14851 5.20086C9.14849 5.41503 9.10584 5.62704 9.02306 5.82456C8.94028 6.02207 8.81902 6.20114 8.66634 6.35133C8.51367 6.50151 8.33263 6.61981 8.13378 6.69934C7.93494 6.77887 7.72225 6.81802 7.50812 6.81453C7.08461 6.80763 6.68078 6.63453 6.38375 6.33258C6.08671 6.03062 5.92027 5.62401 5.92033 5.20044C5.92038 4.77688 6.08693 4.37031 6.38404 4.06843C6.68116 3.76655 7.08503 3.59356 7.50854 3.58677ZM11.3231 14.5192C11.3188 14.6915 11.2473 14.8553 11.1239 14.9756C11.0005 15.0959 10.835 15.1632 10.6627 15.1632C10.4904 15.1632 10.3249 15.0959 10.2015 14.9756C10.0781 14.8553 10.0066 14.6915 10.0022 14.5192V9.89464H9.55969V15.1799H9.55716V22.6483C9.55716 22.764 9.53439 22.8785 9.49014 22.9853C9.44589 23.0921 9.38104 23.1892 9.29928 23.2709C9.21753 23.3527 9.12047 23.4175 9.01364 23.4618C8.90682 23.506 8.79233 23.5288 8.67671 23.5288C8.56109 23.5288 8.4466 23.506 8.33977 23.4618C8.23295 23.4175 8.13589 23.3527 8.05414 23.2709C7.97238 23.1892 7.90752 23.0921 7.86328 22.9853C7.81903 22.8785 7.79626 22.764 7.79626 22.6483V15.1799H7.21533V22.6483C7.21533 22.8819 7.12257 23.1058 6.95746 23.2709C6.79234 23.436 6.56839 23.5288 6.33488 23.5288C6.10137 23.5288 5.87742 23.436 5.71231 23.2709C5.54719 23.1058 5.45443 22.8819 5.45443 22.6483V15.1799H5.45105V9.89464H5.00808V14.5192C5.00808 14.6944 4.9385 14.8624 4.81464 14.9862C4.69079 15.1101 4.5228 15.1797 4.34764 15.1797C4.17248 15.1797 4.00449 15.1101 3.88063 14.9862C3.75678 14.8624 3.68719 14.6944 3.68719 14.5192V9.82503C3.68719 9.80535 3.68804 9.7865 3.68972 9.7685V8.95344C3.68967 8.74949 3.7298 8.54753 3.80782 8.3591C3.88584 8.17066 4.00023 7.99945 4.14444 7.85523C4.28865 7.71102 4.45987 7.59664 4.6483 7.51861C4.83674 7.44059 5.0387 7.40046 5.24265 7.40052H9.76641C9.97036 7.40046 10.1723 7.44059 10.3608 7.51861C10.5492 7.59664 10.7204 7.71102 10.8646 7.85523C11.0088 7.99945 11.1232 8.17066 11.2012 8.3591C11.2793 8.54753 11.3194 8.74949 11.3193 8.95344V9.7685C11.321 9.78706 11.3219 9.80591 11.3219 9.82503V14.5192H11.3231ZM13.7485 23.4229H12.6098V3.51674H13.7485V23.4229ZM23.1436 14.4762C22.9746 14.5213 22.7945 14.4975 22.643 14.4101C22.4915 14.3226 22.3808 14.1786 22.3353 14.0096L21.198 9.7917H20.7204L22.7551 17.423H20.8465V22.6918C20.8465 22.8864 20.7692 23.0731 20.6316 23.2107C20.494 23.3483 20.3073 23.4257 20.1127 23.4257C19.9181 23.4257 19.7314 23.3483 19.5938 23.2107C19.4562 23.0731 19.3788 22.8864 19.3788 22.6918V17.4234H18.7954V22.6918C18.7954 22.8864 18.7181 23.073 18.5805 23.2106C18.4429 23.3481 18.2563 23.4254 18.0617 23.4254C17.8672 23.4254 17.6806 23.3481 17.543 23.2106C17.4054 23.073 17.3281 22.8864 17.3281 22.6918V17.4234H15.4183L17.4458 9.7917H16.9805L15.8634 14.0096C15.8141 14.1742 15.7026 14.313 15.5526 14.3967C15.4026 14.4804 15.2259 14.5024 15.0599 14.4579C14.894 14.4134 14.752 14.306 14.6639 14.1585C14.5759 14.011 14.5488 13.835 14.5884 13.6679L16.0106 8.29869C16.0176 8.27338 16.0259 8.24877 16.0355 8.22486C16.107 7.95761 16.2646 7.7214 16.484 7.55284C16.7033 7.38428 16.9721 7.29278 17.2488 7.29252H20.9128C21.1779 7.29271 21.4361 7.37669 21.6506 7.53247C21.8651 7.68826 22.0249 7.90786 22.1071 8.15989C22.1302 8.2032 22.1487 8.24933 22.1628 8.29827L23.6107 13.6679C23.6558 13.8369 23.632 14.017 23.5445 14.1685C23.457 14.3201 23.3126 14.4307 23.1436 14.4762Z" fill="#0A2463"/>
      </svg>    
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const businessIcon = L.divIcon({
  //KATY FIX
  className: "custom-business-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#0A2463"/>
        <path d="M15 12.5C17.7614 12.5 20 10.2614 20 7.5C20 4.73858 17.7614 2.5 15 2.5C12.2386 2.5 10 4.73858 10 7.5C10 10.2614 12.2386 12.5 15 12.5Z" fill="#C1D5F6" stroke="#C1D5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26.25 27.5C26.25 21.2869 21.2131 16.25 15 16.25C8.78688 16.25 3.75 21.2869 3.75 27.5" stroke="#C1D5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 27.5L17.5 24.375L15 16.25L12.5 24.375L15 27.5Z" fill="#C1D5F6" stroke="#C1D5F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

//special business icons
const restaurantIcon = L.divIcon({
  className: "custom-restaurant-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="white"/>
        <path d="M26.4426 0.337033C26.4426 0.337033 3.57327 0.330002 3.57983 0.337033C1.47187 0.337033 0.286865 1.42688 0.286865 3.65297V26.6058C0.286865 28.6884 1.35233 29.7788 3.45843 29.7788H26.5083C28.6144 29.7788 29.6812 28.7428 29.6812 26.6058V3.65297C29.6817 1.48078 28.6148 0.337033 26.4426 0.337033ZM14.4136 10.9566C14.4136 11.6766 13.7578 12.4477 12.9066 12.4477V24.6047C12.9066 26.3306 10.5544 26.3306 10.5544 24.6047V12.4477C9.72608 12.4477 9.00468 11.8097 9.00468 10.8539V4.16344C9.00468 3.58125 9.84608 3.55875 9.84608 4.18641V9.13172H10.5506V4.14047C10.5506 3.60563 11.3611 3.57141 11.3611 4.16344V9.13172H12.0891V4.1475C12.0891 3.58828 12.8756 3.56578 12.8756 4.16953V9.13172H13.5919V4.1475C13.5919 3.59438 14.4136 3.57235 14.4136 4.16953V10.9566ZM20.6883 24.5991C20.6883 26.287 18.3314 26.2617 18.3314 24.5991V17.1075H17.0766V5.71828C17.0766 3.06703 20.6887 3.06703 20.6887 5.71828V24.5991H20.6883Z" fill="#0A2463"/>
      </svg>    
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const fastfoodIcon = L.divIcon({
  className: "custom-fastfood-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;  z-index: 5;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="1" fill="#0A2463"/>
        <path d="M1.25 18.75C1.25 16.4792 2.19792 14.6617 4.09375 13.2975C5.98958 11.9333 8.16667 11.2508 10.625 11.25C13.0833 11.2492 15.2604 11.9317 17.1563 13.2975C19.0521 14.6633 20 16.4808 20 18.75H1.25ZM1.25 23.75V21.25H20V23.75H1.25ZM2.5 28.75C2.14583 28.75 1.84917 28.63 1.61 28.39C1.37083 28.15 1.25083 27.8533 1.25 27.5V26.25H20V27.5C20 27.8542 19.88 28.1512 19.64 28.3912C19.4 28.6312 19.1033 28.7508 18.75 28.75H2.5ZM22.5 28.75V18.75C22.5 16.375 21.6875 14.3229 20.0625 12.5937C18.4375 10.8646 16.4479 9.70833 14.0937 9.125L13.75 6.25H20V1.25H22.5V6.25H28.75L26.7188 26.5C26.6562 27.1458 26.3904 27.6825 25.9212 28.11C25.4521 28.5375 24.895 28.7508 24.25 28.75H22.5Z" fill="white"/>
      </svg> 
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const cafeIcon = L.divIcon({
  className: "custom-cafe-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#0A2463"/>
        <path d="M5 26.25V23.75H25V26.25H5ZM10 21.25C8.625 21.25 7.44792 20.7604 6.46875 19.7812C5.48958 18.8021 5 17.625 5 16.25V3.75H25C25.6875 3.75 26.2763 3.995 26.7663 4.485C27.2563 4.975 27.5008 5.56333 27.5 6.25V10C27.5 10.6875 27.2554 11.2763 26.7663 11.7663C26.2771 12.2563 25.6883 12.5008 25 12.5H22.5V16.25C22.5 17.625 22.0104 18.8021 21.0313 19.7812C20.0521 20.7604 18.875 21.25 17.5 21.25H10ZM22.5 10H25V6.25H22.5V10Z" fill="white"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const giftshopIcon = L.divIcon({
  className: "custom-giftshop-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#0A2463"/>
        <path d="M4.72253 4.56875C4.49628 5.01875 4.38503 5.57625 4.16253 6.68875L3.41503 10.4262C3.30909 10.9358 3.30827 11.4617 3.41262 11.9716C3.51697 12.4815 3.72429 12.9648 4.02189 13.3918C4.31949 13.8188 4.70111 14.1806 5.14339 14.455C5.58567 14.7294 6.0793 14.9107 6.59406 14.9877C7.10882 15.0647 7.63388 15.0358 8.1371 14.9029C8.64032 14.7699 9.11111 14.5356 9.52064 14.2144C9.93018 13.8932 10.2698 13.4917 10.5188 13.0347C10.7679 12.5776 10.921 12.0745 10.9688 11.5562L11.0563 10.6938C11.0089 11.2423 11.0765 11.7947 11.2547 12.3156C11.4329 12.8366 11.7178 13.3147 12.0912 13.7193C12.4646 14.1239 12.9184 14.4461 13.4234 14.6655C13.9284 14.8848 14.4736 14.9963 15.0242 14.993C15.5748 14.9897 16.1186 14.8716 16.621 14.6462C17.1233 14.4208 17.5731 14.0931 17.9416 13.684C18.3101 13.2749 18.5893 12.7935 18.7612 12.2704C18.9331 11.7474 18.994 11.1942 18.94 10.6463L19.0313 11.5562C19.0791 12.0745 19.2322 12.5776 19.4812 13.0347C19.7302 13.4917 20.0699 13.8932 20.4794 14.2144C20.889 14.5356 21.3597 14.7699 21.863 14.9029C22.3662 15.0358 22.8912 15.0647 23.406 14.9877C23.9208 14.9107 24.4144 14.7294 24.8567 14.455C25.2989 14.1806 25.6806 13.8188 25.9782 13.3918C26.2758 12.9648 26.4831 12.4815 26.5874 11.9716C26.6918 11.4617 26.691 10.9358 26.585 10.4262L25.8375 6.68875C25.615 5.57625 25.5038 5.02 25.2775 4.56875C25.0418 4.0988 24.7098 3.68367 24.3033 3.35031C23.8967 3.01696 23.4246 2.77282 22.9175 2.63375C22.43 2.5 21.8625 2.5 20.7275 2.5H9.27253C8.13753 2.5 7.57003 2.5 7.08253 2.63375C6.57549 2.77282 6.10336 3.01696 5.69678 3.35031C5.29021 3.68367 4.95827 4.0988 4.72253 4.56875ZM22.8363 16.875C23.8129 16.8775 24.7736 16.6273 25.625 16.1487V17.5C25.625 22.2137 25.625 24.5712 24.16 26.035C22.9813 27.215 21.225 27.4437 18.125 27.4887V23.125C18.125 21.9562 18.125 21.3725 17.8738 20.9375C17.7092 20.6525 17.4725 20.4158 17.1875 20.2513C16.7525 20 16.1688 20 15 20C13.8313 20 13.2475 20 12.8125 20.2513C12.5275 20.4158 12.2908 20.6525 12.1263 20.9375C11.875 21.3725 11.875 21.9562 11.875 23.125V27.4887C8.77503 27.4437 7.01878 27.2137 5.84003 26.035C4.37503 24.5712 4.37503 22.2137 4.37503 17.5V16.1487C5.22679 16.6275 6.18795 16.8777 7.16503 16.875C8.60958 16.8759 10.0003 16.3271 11.055 15.34C12.1297 16.3304 13.5386 16.8786 15 16.875C16.4615 16.8786 17.8704 16.3304 18.945 15.34C19.9997 16.3271 21.3917 16.8759 22.8363 16.875Z" fill="white"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const bookstoreIcon = L.divIcon({
  className: "custom-bookstore-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#0A2463"/>
        <path d="M11.85 4.33594C9.73301 3.3252 6.77403 2.83008 2.8125 2.8125C2.43889 2.80742 2.07261 2.91637 1.7625 3.12481C1.50796 3.29685 1.2996 3.52881 1.15575 3.80028C1.01189 4.07175 0.936944 4.37441 0.937503 4.68164V21.4453C0.937503 22.5785 1.74375 23.4334 2.8125 23.4334C6.97676 23.4334 11.1539 23.8225 13.6559 26.1873C13.6901 26.2198 13.7331 26.2415 13.7796 26.2498C13.826 26.258 13.8739 26.2524 13.9172 26.2337C13.9606 26.215 13.9974 26.1839 14.0233 26.1444C14.0491 26.1049 14.0627 26.0587 14.0625 26.0115V6.25898C14.0626 6.12572 14.034 5.994 13.9789 5.8727C13.9237 5.75141 13.8431 5.64336 13.7426 5.55586C13.1695 5.06592 12.5329 4.65557 11.85 4.33594ZM28.2375 3.12305C27.9272 2.91513 27.5609 2.80679 27.1875 2.8125C23.226 2.83008 20.267 3.32285 18.15 4.33594C17.4672 4.65499 16.8304 5.06453 16.2568 5.55352C16.1565 5.64114 16.0761 5.74923 16.021 5.8705C15.966 5.99178 15.9375 6.12344 15.9375 6.25664V26.0104C15.9375 26.0557 15.9508 26.1001 15.9759 26.1378C16.001 26.1756 16.0367 26.2052 16.0785 26.2228C16.1203 26.2403 16.1664 26.2452 16.2109 26.2367C16.2555 26.2282 16.2965 26.2067 16.3289 26.175C17.833 24.6809 20.4727 23.4316 27.1898 23.4322C27.6871 23.4322 28.164 23.2347 28.5157 22.8831C28.8673 22.5314 29.0648 22.0545 29.0648 21.5572V4.68223C29.0655 4.37439 28.9904 4.07112 28.8461 3.79919C28.7018 3.52727 28.4928 3.29505 28.2375 3.12305Z" fill="white"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const hotelIcon = L.divIcon({
  className: "custom-hotel-icon",
  html: `
    <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden;">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" fill="#0A2463"/>
        <path d="M2.5 23.75C2.14583 23.75 1.84917 23.63 1.61 23.39C1.37083 23.15 1.25083 22.8533 1.25 22.5V6.25C1.25 5.89584 1.37 5.59917 1.61 5.36C1.85 5.12084 2.14667 5.00084 2.5 5C2.85333 4.99917 3.15042 5.11917 3.39125 5.36C3.63208 5.60084 3.75167 5.8975 3.75 6.25V17.5H13.75V10C13.75 9.3125 13.995 8.72417 14.485 8.235C14.975 7.74584 15.5633 7.50084 16.25 7.5H23.75C25.125 7.5 26.3021 7.98959 27.2813 8.96875C28.2604 9.94792 28.75 11.125 28.75 12.5V22.5C28.75 22.8542 28.63 23.1513 28.39 23.3913C28.15 23.6313 27.8533 23.7508 27.5 23.75C27.1467 23.7492 26.85 23.6292 26.61 23.39C26.37 23.1508 26.25 22.8542 26.25 22.5V20H3.75V22.5C3.75 22.8542 3.63 23.1513 3.39 23.3913C3.15 23.6313 2.85333 23.7508 2.5 23.75ZM8.75 16.25C7.70833 16.25 6.82292 15.8854 6.09375 15.1563C5.36458 14.4271 5 13.5417 5 12.5C5 11.4583 5.36458 10.5729 6.09375 9.84375C6.82292 9.11459 7.70833 8.75 8.75 8.75C9.79167 8.75 10.6771 9.11459 11.4062 9.84375C12.1354 10.5729 12.5 11.4583 12.5 12.5C12.5 13.5417 12.1354 14.4271 11.4062 15.1563C10.6771 15.8854 9.79167 16.25 8.75 16.25Z" fill="white"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const locationIcon = L.divIcon({
  className: "custom-restroom-icon",
  html: `
    <div style="width: 32px; height: 32px; z-index: 1000;">
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
  trackingData: string | null;
  isTracking: boolean;
  nodes: Node[];
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

const FreedomMap: React.FC<MapProps> = ({ geoJsonData, geoJsonDataRestrooms, trackingData, isTracking, nodes }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [markerPopupOpen, setMarkerPopupOpen] = useState(false);

  useEffect(() => {
    if (!geoJsonData || !geoJsonDataRestrooms || mapRef.current || typeof window === "undefined") return;

    if (!mapContainerRef.current) {
      console.warn("Map container not ready.");
      return;
    }

    requestAnimationFrame(() => {
      const map = L.map(mapContainerRef.current!, {
        center: [42.2626, -71.8023],
        zoom: 13,
      });

      map.on('click', () => {
        setMarkerPopupOpen(false);
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

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

        const marker = L.marker([coordinates[0], coordinates[1]] as [number, number], {
          icon: myIcon,
          interactive: true,
          zIndexOffset: 1000,
        }).addTo(map);

        const container = document.createElement("div");
        container.className =
            "bg-white flex flex-col justify-start rounded-2xl p-2 max-w-[80vw] w-auto h-[60vh] max-h-[500px] overflow-y-auto";

        const root = ReactDOM.createRoot(container);
        root.render(<LocationPage locationName={name} />);
        marker.bindPopup(container);

        marker.on("click", () => {
          marker.openPopup();
          setMarkerPopupOpen(true);
        });

        marker.on("popupclose", () => {
          (document.activeElement as HTMLElement | null)?.blur();
          if (markerPopupOpen) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.body.scrollTop = 0;
          }
          setMarkerPopupOpen(false);
        });

        setTimeout(() => {
          const popupWrapper = container.closest(".leaflet-popup-content-wrapper");
          if (popupWrapper) {
            popupWrapper.classList.add("border-4", "border-[#0a2463]", "rounded-2xl");
          }
        }, 0);
      });

      const allLayers: L.Layer[] = [];

      const pathLayer = L.geoJSON(geoJsonData, {
        style: () => ({
          color: "#D00000",
          weight: 6,
        }),
        pointToLayer: (feature, latlng) => {
          const marker = L.marker(latlng);
          allLayers.push(marker);
          return marker;
        },
      }).addTo(map);

      L.geoJSON(geoJsonDataRestrooms, {
        style: () => ({
          color: "#0A2463",
          weight: 4,
        }),
        pointToLayer: (feature, latlng) => {
          const marker = L.marker(latlng, { icon: restroomIcon });

          const popupContent = document.createElement("div");
          popupContent.className =
              "bg-white p-2 rounded-lg text-black font-garamond font-semibold";
          popupContent.textContent = feature.properties?.name || "Restroom";

          marker.bindPopup(popupContent);

          marker.on("click", () => {
            marker.openPopup();
            setMarkerPopupOpen(true);
          });

          marker.on("popupclose", () => {
            (document.activeElement as HTMLElement | null)?.blur();
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.body.scrollTop = 0;
          });

          allLayers.push(marker);
          return marker;
        },
      }).addTo(map);

      // Recalculate bounds from all added layers
      const bounds = L.featureGroup(allLayers).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }

      // Always do this after setting up the map
      mapRef.current = map;
      map.invalidateSize();

      const getIconByType = (type: string) => {
        switch (type) {
          case 'Restaurant': return restaurantIcon;
          case 'Fast Food': return fastfoodIcon;
          case 'Cafe': return cafeIcon;
          case 'Gift Shop': return giftshopIcon;
          case 'Book Store': return bookstoreIcon;
          case 'Hotel': return hotelIcon;
          case 'Restroom': return restroomIcon;
          default: return businessIcon;
        }
      };

      nodes.forEach((node) => {
        if (node.type !== "Official Site" &&
            typeof node.coordinates[0] === "number" &&
            typeof node.coordinates[1] === "number") {
          const marker = L.marker(
              [node.coordinates[0], node.coordinates[1]],
              { icon: getIconByType(node.type) }
          ).addTo(map);

          const container = document.createElement("div");
          container.className =
              "bg-white flex justify-center rounded-2xl p-1 w-[300px] max-w-[90vw]";
          const root = ReactDOM.createRoot(container);
          root.render(
              <div>
                <h2 className="font-cinzel_decorative font-extrabold text-2xl text-center w-full bg-blue-900 p-2 text-white">
                  {node.name}
                </h2>
                <p className="font-garamond text-md font-semibold">{node.description}</p>
                <p className="font-garamond text-md font-semibold">Type: {node.type}</p>
                <p className="font-garamond text-md font-semibold">Address: {node.address}</p>
                {node.accessibility && (
                    <p className="font-garamond text-md font-semibold">Accessibility: Yes</p>
                )}
                {node.publicRestroom && (
                    <p className="font-garamond text-md font-semibold">Public Restroom: Yes</p>
                )}
              </div>
          );

          marker.bindPopup(container);
          marker.on("click", () => {
            marker.openPopup();
            setMarkerPopupOpen(true);
          });

          marker.on("popupclose", () => {
            (document.activeElement as HTMLElement | null)?.blur();
            if (markerPopupOpen) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              document.body.scrollTop = 0;
            }
            setMarkerPopupOpen(false);
          });
        }
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    });
  }, [geoJsonData, geoJsonDataRestrooms, nodes]);

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
          const newPosition = new L.LatLng(lat, lng);

          if (!markerRef.current) {
            markerRef.current = L.marker(newPosition, { icon: locationIcon }).addTo(mapRef.current);
            mapRef.current.setView(newPosition, 15);
          } else {
            markerRef.current.setLatLng(newPosition);
          }

          setUserPosition(newPosition);

        //for testing reasons
        // const testLat = 42.35532;  // Boston Common latitude
        // const testLng = -71.063639; // Boston Common longitude
        // newPosition = new L.LatLng(testLat, testLng);
        // getBadges()

        if (session) {
          nodes.forEach(({ name, coordinates, type }) => {
            if (type == "Official Site") {
              const locationPoint = new L.LatLng(coordinates[0], coordinates[1]);
              const distance = newPosition.distanceTo(locationPoint);

              if (distance < 9.14) {
                createBadgeObject(name).then();
              }
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

  if (!geoJsonData || !geoJsonDataRestrooms || nodes.length === 0) {
    return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg font-semibold text-gray-600">Loading map data...</p>
        </div>
    );
  }

  return (
      <div className="flex flex-col h-screen">
        <div ref={mapContainerRef} className="flex-grow relative z-20" />
      </div>
  );


  // return <div id="map" style={{}}></div>;
};

export default FreedomMap;
