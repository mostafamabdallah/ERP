"use client";
import dynamic from "next/dynamic";
import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import taswiqa from "../../public/icon.png";
import deliveryMan from "../../public/delivaryman.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

const taswiqaIcon = L.icon({
  iconUrl: taswiqa.src,
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const deliveryManIcon = L.icon({
  iconUrl: deliveryMan.src,
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const position: [number, number] = [30.824350874212136, 30.53429040746672];
const deliveryManPosition: [number, number] = [
  30.82714802683165, 30.534317019077328,
];

// Dynamically import the MapContainer with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Page: React.FC = () => {
  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <Marker position={position} icon={taswiqaIcon}>
        <Popup>مقر التسويقة</Popup>
      </Marker>
      <Marker position={deliveryManPosition} icon={deliveryManIcon}>
        <Popup>
          طيار <br /> محمد
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Page;
