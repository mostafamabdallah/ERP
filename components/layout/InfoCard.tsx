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
    <div className="w-full flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg transition-colors duration-300">
      <div className="flex justify-start gap-3 items-center">
        <div
          className={`flex justify-center items-center ${data.iconBgColor} rounded-full w-9 h-9`}
        >
          <FontAwesomeIcon
            className={`${data.iconColor}`}
            icon={data.icon}
          />
        </div>
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {data.title}
        </span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <span className="text-tittle dark:text-on-surface text-3xl font-bold">
          <Statistic value={data.value} formatter={formatter} />
        </span>

        <div className="flex flex-col">
          <span className="text-green-500">{data.delta}%</span>
          <span className="text-gray-300 dark:text-on-surface-variant">
            vs last {data.period}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
