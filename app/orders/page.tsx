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
import { Customer, Order } from "../../types/global";
import React from "react";
import Link from "next/link";
import OrderTable from "../../components/OrderTable";

type Props = {};

const Page = (props: Props) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["orders"],
    queryFn: (): Promise<Order[]> => {
      return customFetch.get("orders").then((response) => response.data.orders);
    },
    initialData: [],
  });

  const dashboardData = [
    {
      title: "Total Orders",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: data.length,
      delta: 100,
      currency: "users",
      period: "week",
    },
    {
      title: "Delivered Orders",
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: data.filter((el) => {
        return el.status == "success";
      }).length,
      delta: 5,
      currency: "users",
      period: "week",
    },
    {
      title: "Pending Orders",
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: data.filter((el) => {
        return el.status == "pending";
      }).length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Failed Orders",
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: data.filter((el) => {
        return el.status == "failed";
      }).length,
      delta: 1,
      currency: "users",
      period: "week",
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/customers/new"
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon
            className="font-bold"
            icon={faPlus}
          ></FontAwesomeIcon>
          Add New
        </Link>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 ">
        {dashboardData.map((el, i) => {
          return <InfoCard key={i} data={el}></InfoCard>;
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-6 ">
        <div className="w-full ">{<OrderTable orders={data} />}</div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
