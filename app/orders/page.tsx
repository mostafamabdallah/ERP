"use client";
import { Order } from "@/types/global";
import { customFetch } from "@/utilities/fetch";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};
const headNeams = ["ID", "name", "price", "category", "status"];

const Page = (props: Props) => {
  const [orders, setOrdes] = useState<Order[]>([]);
  useEffect(() => {
    customFetch
      .get("orders")
      .then((res) => {
        setOrdes(res.data.items);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-row flex-wrap gap-6 ">
        <div className="w-full lg:flex-[3]">
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
            <tbody></tbody>
          </table>
        </div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
