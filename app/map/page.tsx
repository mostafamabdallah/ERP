"use client";
import React, { useEffect, useState } from "react";
import Map from "@/components/Map";
import { Spin } from "antd";

const Page: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <Map /> : <Spin></Spin>;
};

export default Page;
