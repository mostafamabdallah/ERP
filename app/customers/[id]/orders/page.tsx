"use client";
import InfoCard from "@/components/layout/InfoCard";
import { customFetch } from "@/utilities/fetch";
import {
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};

type Item = {
  id: number;
  name: string;
  price?: number;
  category?: string;
  status?: string;
  unit?: string;
};

type Items = {
  item: Item;
  quantity: number;
};

type Order = {
  id: number;
  date?: string;
  delivary?: number;
  customerId?: number;
  items?: Items[] | undefined;
};

const page = ({ params }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Items[] | undefined>([]);
  const headNeams = ["ID", "date", , "order price", "delivary"];
  const headNeams2 = ["Name", "price", , "quantity", "status"];

  

  const data = [
    {
      title: "Total Orders",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: orders.length,
      delta: 15,
      curancy: "users",
      period: "week",
    },
    {
      title: "Total Money",
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: 0,
      delta: 5,
      curancy: "users",
      period: "week",
    },
  ];
  useEffect(() => {
    customFetch
      .get(`orders/?id=${params.id}`)
      .then((res) => {
        setOrders(res.data.orders.orders);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href={`/orders/customer/${params.id}`}
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon
            className="font-bold"
            icon={faPlus}
          ></FontAwesomeIcon>
          New Order
        </Link>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 ">
        {data.map((el, i) => {
          return <InfoCard key={i} data={el}></InfoCard>;
        })}
      </div>
      <div className="flex flex-row flex-wrap lg:flex-nowrap gap-6 ">
        <div className="w-full lg:w-8/12">
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
              {orders.map((el, i) => {
                let orderPrice = 0;
                el.items?.forEach((el, j) => {
                  let quantity = typeof el != "undefined" && el.quantity;
                  let price = typeof el != "undefined" && el.item.price;
                  let itemPrice = Number(quantity) * Number(price);
                  orderPrice += itemPrice;
                });
                return (
                  <tr
                    onClick={(e) => {
                      setItems(el.items);
                    }}
                    key={i}
                    className="bg-white border-b  font-bold text-sm border-border cursor-pointer hover:bg-[#0f62fe20]"
                  >
                    <td
                      scope="row"
                      className="px-2  py-2 lg:px-4  lg:py-3 font-medium text-gray-900 "
                    >
                      {el.id}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 ">
                      <span className="truncate">
                        {moment(el.date).format("dddd, MMMM D, YYYY h:mm A")}
                      </span>
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 ">
                      <span className="truncate">{orderPrice} EG</span>
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.delivary} EG
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full  bg-white rounded-md  lg:flex-1  px-6 py-4">
          <table className="w-full text-sm text-left text-gray-500  rounded-md  ">
            <thead className="text-xs text-gray-700    ">
              <tr>
                {headNeams2.map((el, i) => {
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
              {items?.map((el, i) => {
                return (
                  <tr
                    key={i}
                    className="bg-white border-b  font-bold text-sm border-border cursor-pointer hover:bg-[#0f62fe20]"
                  >
                    <td
                      scope="row"
                      className="px-2  py-2 lg:px-4  lg:py-3 font-medium text-gray-900 "
                    >
                      {el.item.name}
                    </td>

                    <td className="px-2  py-2 lg:px-4  lg:py-3 ">
                      <span className="truncate">{el.item.price} EG</span>
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 ">
                      <span className="truncate">{el.quantity}</span>
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.item.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
