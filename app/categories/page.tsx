"use client";
import { Category } from "@/types/global";
import { customFetch } from "@/utilities/fetch";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Page = () => {
  const { t } = useLanguage();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[]> => {
      return customFetch
        .get("categories")
        .then((response) => response.data.categories);
    },
    initialData: [],
  });

  const headNames = [t.categories.id, t.categories.name];

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/categories/new"
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon className="font-bold" icon={faPlus} />
          {t.common.addNew}
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-6">
        <div className="w-full lg:flex-[3]">
          <table className="w-full text-sm text-left text-gray-500 rounded-md">
            <thead className="text-xs text-gray-700">
              <tr>
                {headNames.map((el, i) => (
                  <th
                    scope="col"
                    className="px-2 capitalize py-1 lg:px-4 lg:py-3 font-bold lg:text-base text-sm sticky top-0 bg-white dark:bg-surface-mid text-tittle dark:text-on-surface"
                    key={i}
                  >
                    {el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.data.map((el, i) => (
                <tr
                  key={i}
                  className="bg-white dark:bg-surface-mid border-b font-bold text-sm border-border dark:border-outline-dark transition-colors duration-300"
                >
                  <td
                    scope="row"
                    className="px-2 py-2 lg:px-4 lg:py-3 font-medium text-gray-900 dark:text-on-surface"
                  >
                    {el.id}
                  </td>
                  <td className="px-2 py-2 lg:px-4 lg:py-3 text-gray-700 dark:text-on-surface">
                    <span className="truncate">{el.name}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:w-4/12 bg-white dark:bg-surface-mid rounded-md flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
