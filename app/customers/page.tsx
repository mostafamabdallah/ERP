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
import { Customer } from "../../types/global";
import React from "react";
import Link from "next/link";
import CustomerTable from "./components/CustomerTable";

type Props = {};

const Page = (props: Props) => {
  const customers = useQuery({
    queryKey: ["customers"],
    queryFn: (): Promise<Customer[]> => {
      return customFetch
        .get("customers")
        .then((response) => response.data.customers);
    },
    initialData: [],
  });
  const dashboardData = [
    {
      title: "Total Customers",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: customers.data.length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Verified Customers",
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: customers.data.filter((el) => {
        return el.status == "Verified";
      }).length,
      delta: 5,
      currency: "users",
      period: "week",
    },
    {
      title: "Warned Customers",
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: customers.data.filter((el) => {
        return el.status == "warned";
      }).length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Blocked Customers",
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: customers.data.filter((el) => {
        return el.status == "blocked";
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
        <div className="w-full ">
          {<CustomerTable customers={customers.data} />}
        </div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
