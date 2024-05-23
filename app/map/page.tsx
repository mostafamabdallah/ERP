"use client";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import dynamic from "next/dynamic";

const Page: React.FC = () => {
  const Map = React.useMemo(
    () => dynamic(() => import("../../components/Map"), { ssr: false }),
    []
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <Map /> : <Spin></Spin>;
};

export default Page;
