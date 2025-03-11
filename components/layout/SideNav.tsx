"use client";
import React, { memo } from "react";
import logo from "@/public/logoo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faUsers,
  faTruckFast,
  faBagShopping,
  faLayerGroup,
  faMap,
  faBriefcase,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { usePathname } from "next/navigation";
const pages = [
  {
    name: "Dashboard",
    icon: faGrip,
    url: "/",
  },
  {
    name: "Customers",
    icon: faUsers,
    url: "/customers",
  },
  {
    name: "Orders",
    icon: faTruckFast,
    url: "/orders",
  },
  {
    name: "Employees",
    icon: faBriefcase,
    url: "/employees",
  },
  {
    name: "Expenses",
    icon: faMoneyBill,
    url: "/expenses",
  },
];

type Props = {};

const SideNav = (props: Props) => {
  const pathname = usePathname();
  return (
    <div className=" flex-col hidden lg:flex lg:w-3/12 xl:w-2/12 border-r-2 border-border h-screen bg-white lg:px-6 pt-8">
      <div className="flex flex-row mb-10">
        <img src={logo.src} className="w-full lg:w-8/12"></img>
      </div>

      <span className="text-gray2 mb-3">MENU</span>
      <div className="flex flex-col">
        {pages.map((el, i) => {
          return (
            <Link
              key={i}
              href={el.url}
              className={` ${
                pathname == el.url &&
                "bg-[#0f62fe15] text-primary before:content-[''] before:w-1.5  before:h-[calc(100%+1.5rem)] before:rounded-l-lg before:bg-primary before:-ml-[1rem]"
              } flex flex-row gap-4 items-center justify-between px-4 py-3 rounded-md text-gray1 hover:bg-[#0f62fe15] hover:text-primary`}
            >
              <div className="flex w-fit">
                <FontAwesomeIcon
                  icon={el.icon}
                  className="w-6 h-6  font-bold"
                ></FontAwesomeIcon>
              </div>
              <div className="flex-1">
                <span className="text-lg ">{el.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default memo(SideNav);
