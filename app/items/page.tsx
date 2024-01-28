"use client";
import { Item } from "@/types/global";
import { customFetch } from "@/utilities/fetch";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};
const headNames = ["ID", "name", "price", "category", "Quantity", "unit"];

const Page = (props: Props) => {
  const items = useQuery({
    queryKey: ["items"],
    queryFn: (): Promise<Item[]> => {
      return customFetch.get("items").then((response) => response.data.items);
    },
    initialData: [],
  });

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/items/new"
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon
            className="font-bold"
            icon={faPlus}
          ></FontAwesomeIcon>
          Add New
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-6 ">
        <div className="w-full lg:flex-[3]">
          <table className="w-full text-sm text-left text-gray-500  rounded-md  ">
            <thead className="text-xs text-gray-700    ">
              <tr>
                {headNames.map((el, i) => {
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
              {items.data.map((el, i) => {
                console.log(el);

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
                      {el.price} {"EG"}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.categories?.map((el, i) => {
                        return <span key={i}>{el.name}</span>;
                      })}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.quantity}
                    </td>
                    <td className="px-2  py-2 lg:px-4  lg:py-3 truncate">
                      {el.unit}
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
