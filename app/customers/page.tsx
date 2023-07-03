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
import { useRouter } from "next/navigation";

type Props = {};

const headNeams = ["ID", "name", "location", "phone", "status", "orders"];

const Page = (props: Props) => {
  const { push } = useRouter();

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
          <table className="w-full text-sm text-left text-gray-500  rounded-md  ">
            <thead className="text-xs text-gray-700    ">
              <tr>
                {headNeams.map((el, i) => {
                  return (
                    <th
                      scope="col"
                      className="px-2 capitalize py-1 lg:px-4  lg:py-3 font-bold lg:text-base text-sm sticky  top-0 bg-white text-tittle "
                      key={i}
                    >
                      {el}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {customers.map((el, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-white border-b  font-bold text-sm border-border"
                  >
                    <td
                      scope="row"
                      className="px-2  py-2 lg:px-4  lg:py-3 font-medium text-gray-900 "
                    >
                      {el.id}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 ">
                      <span className="truncate">{el.name}</span>
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.adress}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.phone}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {" "}
                      <div
                        className={` ${
                          el.status == "verfied"
                            ? "bg-[#8cbfad20]"
                            : el.status == "warned"
                            ? "bg-[#a3965f20]"
                            : "bg-[#ff939820]"
                        } flex justify-center items-center  w-full px-3 py-1 rounded-sm`}
                      >
                        <span
                          className={`${
                            el.status == "verfied"
                              ? "text-[#8cbfad]"
                              : el.status == "warned"
                              ? "text-[#a3965f]"
                              : "text-[#ff9398]"
                          } `}
                        >
                          {el.status}
                        </span>
                      </div>
                    </td>
                    <td className="flex items-center justify-start gap-2 px-2  py-2 lg:px-4  lg:py-3">
                      <FontAwesomeIcon
                        onClick={() => {
                          push(`/orders/customer/${el.id}`);
                        }}
                        className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
                        icon={faPlus}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon
                        onClick={() => {
                          push(`/customers/${el.id}/orders`);
                        }}
                        className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
                        icon={faEye}
                      ></FontAwesomeIcon>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
