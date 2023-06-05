"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPills, faUser } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const TopNav = (props: Props) => {
  const pathname = usePathname();
  const pageName = pathname.split("/")[1].split("-").join(" ");

  return (
    <div className="flex flex-row w-full items-center justify-between py-6 ">
      <span className="text-3xl text-tittle capitalize">
        {pageName ? pageName : "Dashboard"}
      </span>
      <span className="flex gap-4 items-center justify-center">
        <div className="flex relative rounded-full text-xl w-12 h-12  items-center justify-center bg-white border border-border cursor-pointer">
          <span className="flex items-center justify-center w-5 h-5 text-sm bg-red-600 text-white absolute -top-1 -right-1 rounded-full">
            4
          </span>
          <FontAwesomeIcon
            className="text-tittle"
            icon={faBell}
          ></FontAwesomeIcon>
        </div>
        <FontAwesomeIcon
          className="bg-[#0f62fe15] p-3 text-xl rounded-full text-primary border border-primary"
          icon={faUser}
        ></FontAwesomeIcon>
      </span>
    </div>
  );
};

export default TopNav;
