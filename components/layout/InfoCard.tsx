"use client";
import { CardData } from "@/types/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Statistic } from "antd";
import React from "react";
import CountUp from "react-countup";

type Props = {
  data: CardData;
};

const formatter = (value: any) => <CountUp end={value} separator="," />;

const InfoCard = ({ data }: Props) => {
  return (
    <div className="w-full flex flex-col gap-3 px-6 py-4 bg-white rounded-lg ">
      <div className="flex justify-start gap-3 items-center">
        <div
          className={`flex justify-center items-center ${data.iconBgColor} rounded-full w-9 h-9`}
        >
          <FontAwesomeIcon
            className={`${data.iconColor}`}
            icon={data.icon}
          ></FontAwesomeIcon>
        </div>
        <span className="text-gray-500 font-bold text-lg">{data.title}</span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <span className="text-tittle  text-3xl font-bold">
          <Statistic value={data.value} formatter={formatter} />
        </span>

        <div className="flex flex-col">
          <span className="text-green-500">{data.delta}%</span>
          <span className="text-gray-300">vs last {data.period}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
