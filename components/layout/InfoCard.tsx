"use client";
import { CardData } from "@/types/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CountUp from "react-countup";

type Props = {
  data: CardData;
};

const InfoCard = ({ data }: Props) => {
  const isNegative = data.isProfit && data.value < 0;

  return (
    <div className="w-full flex flex-col gap-3 px-6 py-5 bg-white dark:bg-surface-mid rounded-lg transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-on-surface-variant font-semibold text-sm">
            {data.title}
          </span>
          <span
            className={`text-3xl font-bold ${
              data.isProfit
                ? isNegative
                  ? "text-red-500"
                  : "text-green-500"
                : "text-tittle dark:text-on-surface"
            }`}
          >
            <CountUp
              end={data.value}
              separator=","
              suffix={data.isCurrency ? " ج.م" : ""}
              duration={1.2}
            />
          </span>
        </div>
        <div
          className={`flex justify-center items-center ${data.iconBgColor} rounded-xl w-11 h-11`}
        >
          <FontAwesomeIcon className={`${data.iconColor} text-lg`} icon={data.icon} />
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
