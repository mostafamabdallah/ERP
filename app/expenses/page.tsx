"use client";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Employee, Expense } from "../../types/global";
import React from "react";
import Link from "next/link";
import ExpensesTable from "./components/ExpensesTable";

type Props = {};

const Page = (props: Props) => {
  const expenses = useQuery({
    queryKey: ["expenses"],
    queryFn: (): Promise<Expense[]> => {
      return customFetch
        .get("expenses")
        .then((response) => response.data);
    },
    initialData: [],
  });

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/expenses/new"
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
        <div className="w-full ">
          {<ExpensesTable expenses={expenses.data} />}
        </div>
        <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
      </div>
    </div>
  );
};


export default Page;
