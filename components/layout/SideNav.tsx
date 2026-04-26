"use client";
import React, { memo } from "react";
import logo from "@/public/logoo.png";
import logoDark from "@/public/logooDark.png";
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
import { useTheme } from "@/contexts/ThemeContext";
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
  const { isDark } = useTheme();
  return (
    <div className="flex-col hidden lg:flex lg:w-3/12 xl:w-2/12 border-r-2 border-border dark:border-outline-dark h-screen bg-white dark:bg-surface-low lg:px-6 pt-8 transition-colors duration-300">
      <div className="flex flex-row mb-10">
        <img
          src={isDark ? logoDark.src : logo.src}
          className={`w-full lg:w-8/12 ${isDark ? "mix-blend-screen" : ""}`}
          alt="Taswiqa logo"
        />
      </div>

      <span className="text-gray2 dark:text-on-surface-variant mb-3 text-xs font-semibold tracking-widest">
        MENU
      </span>
      <div className="flex flex-col">
        {pages.map((el, i) => {
          const isActive = pathname == el.url;
          return (
            <Link
              key={i}
              href={el.url}
              className={`${
                isActive
                  ? "bg-[#0f62fe15] dark:bg-[#d09afa20] text-primary dark:text-primary-dark before:content-[''] before:w-1.5 before:h-[calc(100%+1.5rem)] before:rounded-l-lg before:bg-primary dark:before:bg-primary-dark before:-ml-[1rem]"
                  : "text-gray1 dark:text-on-surface-variant"
              } flex flex-row gap-4 items-center justify-between px-4 py-3 rounded-md hover:bg-[#0f62fe15] dark:hover:bg-[#d09afa15] hover:text-primary dark:hover:text-primary-dark transition-colors duration-200`}
            >
              <div className="flex w-fit">
                <FontAwesomeIcon
                  icon={el.icon}
                  className="w-6 h-6 font-bold"
                />
              </div>
              <div className="flex-1">
                <span className="text-lg">{el.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default memo(SideNav);
