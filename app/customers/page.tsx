import InfoCard from "@/components/layout/InfoCard";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col w-full">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        <InfoCard></InfoCard>
        <InfoCard></InfoCard>
        <InfoCard></InfoCard>
        <InfoCard></InfoCard>
      </div>
    </div>
  );
};

export default page;
