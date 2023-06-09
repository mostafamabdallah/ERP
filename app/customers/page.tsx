"use client";
import InfoCard from "@/components/layout/InfoCard";
import { customFetch } from "@/utilities/fetch";
import {
  faCheckCircle,
  faExclamationCircle,
  faEye,
  faLock,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Customer } from "../../types/global";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomerTable from "./components/CustomerTable";

type Props = {};

const headNeams = ["ID", "name", "location", "phone", "status", "orders"];

const Page = (props: Props) => {

  const [customers, setCustomer] = useState<Customer[]>([]);
  const data = [
    {
      title: "Total Customers",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: customers.length,
      delta: 15,
      curancy: "users",
      period: "week",
    },
    {
      title: "Verfied Customers",
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: customers.filter((el) => {
        return el.status == "verfied";
      }).length,
      delta: 5,
      curancy: "users",
      period: "week",
    },
    {
      title: "Warned Customers",
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: customers.filter((el) => {
        return el.status == "warned";
      }).length,
      delta: 15,
      curancy: "users",
      period: "week",
    },
    {
      title: "Blocked Customers",
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: customers.filter((el) => {
        return el.status == "blocked";
      }).length,
      delta: 1,
      curancy: "users",
      period: "week",
    },
  ];
  useEffect(() => {
    customFetch
      .get("customers")
      .then((res) => {
        setCustomer(res.data.customers);
      })
      .catch((err) => {});
  }, []);
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
        {data.map((el, i) => {
          return <InfoCard key={i} data={el}></InfoCard>;
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-6 ">
        <div className="w-full ">
          {<CustomerTable customers={customers}></CustomerTable>}
        </div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
