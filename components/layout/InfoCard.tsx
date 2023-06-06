import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {};

const InfoCard = (props: Props) => {
  return (
    <div className="w-full flex flex-col gap-3 px-6 py-4 bg-white rounded-lg shadow">
      <div className="flex justify-start gap-3 items-center">
        <div className="flex justify-center items-center bg-[#0f62fe20] rounded-full w-9 h-9">
          <FontAwesomeIcon
            className="text-[#0f62fe] "
            icon={faUser}
          ></FontAwesomeIcon>
        </div>
        <span className="text-gray-500 font-bold text-lg">Total Customer</span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <span className="text-tittle  text-3xl font-bold">$612.839</span>
        <div className="flex flex-col">
          <span className="text-green-500">16%</span>
          <span className="text-gray-300">vs last week</span>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
