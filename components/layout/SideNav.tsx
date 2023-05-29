import React from "react";
import logo from "../../public/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {};

const SideNav = (props: Props) => {
  return (
    <div className="flex flex-col w-2/12 border-2 border-border h-screen bg-white lg:px-6 pt-8">
      <div className="flex flex-row ">
        <img src={logo.src} className="w-full"></img>
      </div>

      <span className="text-gray2">MENU</span>
      <div className="flex flex-col">
        {/* <Link
          href={"/"}
          className="flex flex-row gap-4 items-center justify-between px-4 py-3 rounded-md text-gray1 hover:bg-[#0f62fe15] hover:text-primary"
        >
          <div className="flex w-fit">
            <FontAwesomeIcon
              icon={faGrip}
              className="w-6 h-6  font-bold"
            ></FontAwesomeIcon>
          </div>
          <div className="flex-1">
            <span className="text-lg ">Overview</span>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default SideNav;
