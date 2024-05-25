"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import taswiqa from "../public/icon.png";
import deliveryMan from "../public/delivaryman.png";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { Spin } from "antd";
import { Employee } from "@/types/global";

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
const Map: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`employees_delivery`],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`employees?type=delivery`)
        .then((response) => response.data.employees);
    },
    refetchOnWindowFocus: true,
    refetchInterval: 1000
  });

  return !isLoading ? (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <Marker position={position} icon={taswiqaIcon}>
        <Popup>مقر التسويقة</Popup>
      </Marker>
      {data?.map((el: Employee, i: number) => {
        return (
          <Marker
            key={i}
            position={[el.latitude, el.longitude]}
            icon={deliveryManIcon}
          >
            <Popup>
              طيار <br /> {el.name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  ) : (
    <Spin></Spin>
  );
};

export default Map;
