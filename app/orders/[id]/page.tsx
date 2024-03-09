"use client";
import { customFetch } from "@/utilities/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import logo from "@/public/slogn.png";
import QR from "@/public/QR.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhoneFlip,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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

  const handlePrint = () => {
    const printContent = document.getElementById("invoice")?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write("<html><head><title>Print Section</title>");
    // Include Tailwind CSS in the print window
    printWindow.document.write(
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">'
    );
    printWindow.document.write(
      '</head><body style="width:72.1mm ;  direction: rtl" >'
    );
    printWindow.document.write(
      "<style> @media print { @page { size: auto; margin: 5px; } body { margin: 0 } } </style>"
    );
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div
        id="invoice"
        className="flex flex-col w-full items-center "
        style={{ direction: "rtl" }}
      >
        <div className="flex flex-col w-[300px]" style={{ width: "72.1mm" }}>
          <div className="flex justify-center  items-start flex-wrap ">
            <div className="w-6/12">
              {" "}
              <img src={logo.src} className="w-full "></img>
            </div>
            <div className="w-full">
              <p className="flex justify-between text-xs">
                <span>
                  رقم الطلب: <span>{data?.id}</span>
                </span>
                <span>
                  ID: <span>{data?.customer.id}</span>
                </span>
              </p>
              <p className="flex justify-between text-xs">
                <span className="flex gap-1 items-center">
                  <FontAwesomeIcon
                    className=" w-3"
                    icon={faUser}
                  ></FontAwesomeIcon>{" "}
                  <span>{data?.customer.name}</span>
                </span>
                <span className="flex gap-1 items-center">
                  <FontAwesomeIcon
                    className=" w-3"
                    icon={faPhoneFlip}
                  ></FontAwesomeIcon>{" "}
                  <span>{data?.customer.phone}</span>
                </span>
              </p>
              <p className="flex justify-between text-xs">
                <span className="flex gap-1 items-center">
                  <FontAwesomeIcon
                    className=" w-3"
                    icon={faLocationDot}
                  ></FontAwesomeIcon>
                  {data?.customer.address}
                </span>
              </p>
              <p className="flex justify-between text-xs">
                <span className="text-xs">{formattedDate}</span>
              </p>
            </div>
          </div>
          <table className="border border-black mt-1">
            <thead className="bg-slate-200 border border-black">
              <tr>
                <th className="py-1 border border-black text-xs">م</th>
                <th className="py-1 border border-black text-xs">أسم الصنف</th>
                <th className="py-1 border border-black text-xs">كمية</th>
                <th className="py-1 border border-black text-xs">السعر</th>
                <th className="py-1 border border-black text-xs">القيمة</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((el: any, i: number) => {
                totalCost += Number(el.quantity) * Number(el.item.price);
                return (
                  <tr key={i}>
                    <td className="text-center border border-black text-xs">
                      {i + 1}
                    </td>
                    <td className="text-center border border-black text-xs">
                      {el.item.name}
                    </td>
                    <td className="text-center border border-black text-xs">
                      {" "}
                      {el.quantity}
                    </td>
                    <td className="text-center border border-black text-xs">
                      {el.item.price}
                    </td>
                    <td className="text-center border border-black text-xs">
                      {Number(el.quantity) * Number(el.item.price)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  className="text-center border border-black text-xs"
                  colSpan={3}
                >
                  اجمالي المنتجات{" "}
                </td>
                <td
                  className="text-center border border-black text-xs"
                  colSpan={2}
                >
                  {totalCost}
                </td>
              </tr>
              <tr>
                <td
                  className="text-center border border-black text-xs"
                  colSpan={3}
                >
                  التوصيل{" "}
                </td>
                <td
                  className="text-center border border-black text-xs"
                  colSpan={2}
                >
                  {data?.deliveryCost}
                </td>
              </tr>
              <tr className="bg-slate-200 font-bold">
                <td
                  className="text-center border border-black text-xs"
                  colSpan={3}
                >
                  اجمالي الفاتورة{" "}
                </td>
                <td
                  className="text-center border border-black text-xs"
                  colSpan={2}
                >
                  {totalCost + Number(data?.deliveryCost)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col items-center justify-around mt-2 text-sm">
            <div className="w-full flex items-center">
              <div className="w-9/12 flex flex-col">
                <span className="flex gap-1 items-center">
                  <FontAwesomeIcon
                    className="w-3"
                    icon={faWhatsapp}
                  ></FontAwesomeIcon>{" "}
                  <span>01125342420</span>
                </span>
                <span className="flex gap-1 items-center">
                  <FontAwesomeIcon
                    className="w-3"
                    icon={faPhoneFlip}
                  ></FontAwesomeIcon>{" "}
                  <span>01080790884</span>
                </span>
              </div>{" "}
              <div className="w-3/12 ">
                <img src={QR.src}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handlePrint}>Print Section</button>
    </>
  );
};

export default Page;
