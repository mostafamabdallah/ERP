"use client";
import { customFetch } from "@/utilities/fetch";
import { Order } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import logo from "@/public/logoo.png";

type Props = {};

type OrderData = {
  id: number;
  orderNumber: string;
  customerId: number;
  deliveryCost: number;
  status: string;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    address: string;
    phone: string;
    status: string;
    type: string;
    createdAt: string;
  };
  items: [
    {
      orderId: number;
      itemId: number;
      quantity: number;
      item: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        unit: string;
      };
    }
  ];
};

const Page = ({ params }: { params: { id: string } }) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["singleOrder"],
    queryFn: (): Promise<OrderData> => {
      return customFetch
        .get(`orders/${params.id}`)
        .then((response) => response.data.order);
    },
  });

  let totalCost = 0;
  const formattedDate = isSuccess
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "";

  return (
    <div
      className="flex flex-col w-full items-center "
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col w-[500px] border-2 border-black p-4">
        <div className="flex justify-between items-start">
          <div className="10/12">
            <p>
              رقم الطلب: <span className="font-bold">{data?.id}</span>
            </p>
            <p className="border border-black p-1.5 w-fit  mt-3">
              التاريخ : <span className="font-bold">{formattedDate}</span>
            </p>
            <p className="border border-black p-1.5 w-fit my-3">
              {" "}
              طيار : <span className="font-bold">{"حمادة"}</span>
            </p>
          </div>
          <div className="w-2/12">
            {" "}
            <img src={logo.src} className="w-full "></img>
          </div>
        </div>
        <table className="border border-black">
          <thead className="bg-slate-200 border border-black">
            <tr>
              <th className="py-3 border border-black">م</th>
              <th className="py-3 border border-black">أسم الصنف</th>
              <th className="py-3 border border-black">عدد</th>
              <th className="py-3 border border-black">السعر</th>
              <th className="py-3 border border-black">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((el: any, i: number) => {
              totalCost += Number(el.quantity) * Number(el.item.price);
              return (
                <tr key={i}>
                  <td className="text-center border border-black">{i + 1}</td>
                  <td className="text-center border border-black">
                    {el.item.name}
                  </td>
                  <td className="text-center border border-black">
                    {" "}
                    {el.quantity}
                  </td>
                  <td className="text-center border border-black">
                    {el.item.price}
                  </td>
                  <td className="text-center border border-black">
                    {Number(el.quantity) * Number(el.item.price)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="text-center border border-black" colSpan={3}>
                اجمالي المنتجات{" "}
              </td>
              <td className="text-center border border-black" colSpan={2}>
                {totalCost}
              </td>
            </tr>
            <tr>
              <td className="text-center border border-black" colSpan={3}>
                التوصيل{" "}
              </td>
              <td className="text-center border border-black" colSpan={2}>
                {data?.deliveryCost}
              </td>
            </tr>
            <tr className="bg-slate-200 font-bold">
              <td className="text-center border border-black" colSpan={3}>
                اجمالي الفاتورة{" "}
              </td>
              <td className="text-center border border-black " colSpan={2}>
                {totalCost + Number(data?.deliveryCost)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col items-center justify-center mt-5 ">
          <p className="text-xl font-bold">ت : 01210671670</p>
          <p className="text-xl font-bold ">تسويقة : لحد باب البيت</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
