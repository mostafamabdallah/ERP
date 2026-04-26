"use client";
import InfoCard from "@/components/layout/InfoCard";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import {
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Order } from "../../types/global";
import React from "react";
import Link from "next/link";
import OrderTable from "../../components/OrderTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Page = () => {
  const { t } = useLanguage();

  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: (): Promise<Order[]> => {
      return customFetch.get("orders").then((response) => response.data.orders);
    },
    initialData: [],
  });

  const dashboardData = [
    {
      title: t.orders.totalOrders,
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: data.length,
      delta: 100,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.deliveredOrders,
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: data.filter((el) => el.status == "success" || el.status == "money_collected").length,
      delta: 5,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.pendingOrders,
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: data.filter((el) => el.status == "pending").length,
      delta: 15,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.failedOrders,
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: data.filter((el) => el.status == "failed").length,
      delta: 1,
      currency: "users",
      period: t.dashboard.week,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/customers/new"
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon className="font-bold" icon={faPlus} />
          {t.common.addNew}
        </Link>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardData.map((el, i) => (
          <InfoCard key={i} data={el} />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-6">
        <div className="w-full">
          <OrderTable orders={data} />
        </div>
        <div className="w-full lg:w-4/12 bg-white dark:bg-surface-mid rounded-md flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
