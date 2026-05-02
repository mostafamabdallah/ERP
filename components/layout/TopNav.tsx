"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faClose,
  faGlobe,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const TopNav = () => {
  const pathname = usePathname();
  const pageName = pathname.split("/");
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
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
      <div className="flex flex-row w-full items-center justify-between py-3 border-b-2 border-border dark:border-outline-dark lg:px-10 bg-background dark:bg-surface transition-colors duration-300">
        <span className="text-lg text-gray-600 dark:text-on-surface-variant capitalize">
          {pageName[1]
            ? pageName.map((el, i) => {
                if (i == 0) {
                  return el;
                } else {
                  return " / " + el;
                }
              })
            : t.nav.dashboard}
        </span>
        <span className="flex gap-3 items-center justify-center">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            title={language === "ar" ? "Switch to English" : "التبديل للعربية"}
            className="flex relative rounded-full text-sm font-bold w-12 h-12 items-center justify-center bg-white dark:bg-surface-mid border border-border dark:border-outline-dark cursor-pointer hover:bg-gray-100 dark:hover:bg-surface-high transition-colors duration-200 gap-1"
          >
            <FontAwesomeIcon
              className="text-primary dark:text-primary-dark text-base"
              icon={faGlobe}
            />
            <span className="text-[10px] font-bold text-primary dark:text-primary-dark leading-none">
              {language === "ar" ? "EN" : "عر"}
            </span>
          </button>

          {/* Dark / Light mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex relative rounded-full text-xl w-12 h-12 items-center justify-center bg-white dark:bg-surface-mid border border-border dark:border-outline-dark cursor-pointer hover:bg-gray-100 dark:hover:bg-surface-high transition-colors duration-200"
          >
            <FontAwesomeIcon
              className={isDark ? "text-[#fcd401]" : "text-gray-700"}
              icon={isDark ? faMoon : faSun}
            />
          </button>

          {/* Notification bell */}
          <div className="flex relative rounded-full text-xl w-12 h-12 items-center justify-center bg-white dark:bg-surface-mid border border-border dark:border-outline-dark cursor-pointer">
            <span className="flex items-center justify-center w-5 h-5 text-sm bg-red-600 text-white absolute -top-1 -right-1 rounded-full">
              4
            </span>
            <FontAwesomeIcon
              className="text-tittle dark:text-on-surface"
              icon={faBell}
            />
          </div>

          {/* User icon */}
          <FontAwesomeIcon
            className="bg-[#0f62fe15] dark:bg-[#d09afa20] p-3 text-xl rounded-full text-primary dark:text-primary-dark border border-primary dark:border-primary-dark"
            icon={faUser}
          />
        </span>
      </div>

      {/* Mobile nav */}
      <aside className="lg:w-[20%] 2xl:w-[20%] bg-primary lg:hidden flex relative z-[999999]">
        <nav className="lg:hidden w-full flex">
          <div className="mx-auto flex flex-row items-center justify-start text-primary fixed px-2 p-5">
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
              />
            </button>
          </div>
          <motion.div
            initial={{ display: "none", x: 1000 }}
            animate={animate}
            transition={{ duration: 1 }}
            className="bg-primary w-screen h-screen flex flex-col justify-center items-center fixed"
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
              />
            </button>
            <div className="container mx-auto">
              <ul className="w-full flex gap-2 justify-end items-center flex-col">
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/"}>{t.nav.dashboard}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/customers"}>{t.nav.customers}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/orders"}>{t.nav.orders}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/items"}>{t.nav.items}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/categories"}>{t.nav.categories}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/daily-prices"}>{t.nav.dailyPrices}</Link>
                </li>
                <li
                  onClick={() => callBackAnimate()}
                  className="px-5 py-2 text-white font-bold tracking-[0.2rem] hover:text-black text-lg"
                >
                  <Link href={"/daily-stats"}>{t.nav.dailyStats}</Link>
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
