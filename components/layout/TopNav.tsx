"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faClose,
  faPills,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {};

const TopNav = (props: Props) => {
  const pathname = usePathname();
  const pageName = pathname.split("/");
  const [animate, setAnimate] = useState({
    opacity: 0,
    display: "none",
    x: 1000,
  });

  function callBackAnimate() {
    setAnimate({ opacity: 0, display: "flex", x: 1000 });
  }

  return (
    <>
      <div className="flex flex-row w-full items-center justify-between py-3 border-b-2 border-border lg:px-10">
        <span className="text-lg text-gray-600 capitalize">
          {pageName[1]
            ? pageName.map((el, i) => {
                if (i == 0) {
                  return el;
                } else {
                  return " / " + el;
                }
              })
            : "Dashboard"}
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

      <aside className="lg:w-[20%] 2xl:w-[20%] bg-primary  lg:hidden flex relative z-[999999] ">
        <nav className="lg:hidden  w-full flex ">
          <div className=" mx-auto flex flex-row items-center justify-start text-primary fixed px-2 p-5 ">
            <button
              className="w-fit"
              onClick={() => {
                setAnimate({ opacity: 1, display: "flex", x: 0 });
              }}
            >
              <FontAwesomeIcon
                className={`text-2xl cursor-pointer text-primary bg-secondary p-3 rounded-full ${
                  animate.opacity && "hidden"
                }`}
                icon={faBars}
              ></FontAwesomeIcon>
            </button>
          </div>
          <motion.div
            initial={{ display: "none", x: 1000 }}
            animate={animate}
            transition={{
              duration: 1,
            }}
            className="bg-primary w-screen h-screen flex flex-col justify-center items-center fixed "
          >
            <button
              onClick={() => {
                setAnimate({ opacity: 0, display: "flex", x: 1000 });
              }}
              className="p-5 absolute top-0 right-0 cursor-pointer"
            >
              <FontAwesomeIcon
                className="pl-3 text-5xl text-white"
                icon={faClose}
              ></FontAwesomeIcon>
            </button>
            <div className="container mx-auto">
              <ul className="w-full flex gap-2 justify-end items-center flex-col ">
                <li
                  onClick={(e) => {
                    callBackAnimate();
                  }}
                  className="px-5 py-2 text-white font-bold font-ITCAVANTGARDESTD tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/"}>Dashboard</Link>
                </li>
                <li
                  onClick={(e) => {
                    callBackAnimate();
                  }}
                  className="px-5 py-2 text-white font-bold font-ITCAVANTGARDESTD tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/customers"}>Customers</Link>
                </li>
                <li
                  onClick={(e) => {
                    callBackAnimate();
                  }}
                  className="px-5 py-2 text-white font-bold font-ITCAVANTGARDESTD tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/orders"}>Orders</Link>
                </li>
                <li
                  onClick={(e) => {
                    callBackAnimate();
                  }}
                  className="px-5 py-2 text-white font-bold font-ITCAVANTGARDESTD tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/items"}>Items</Link>
                </li>
                <li
                  onClick={(e) => {
                    callBackAnimate();
                  }}
                  className="px-5 py-2 text-white font-bold font-ITCAVANTGARDESTD tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/categories"}>Categories</Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </nav>
      </aside>
    </>
  );
};

export default TopNav;
