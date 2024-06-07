import { customFetch } from "@/utilities/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import InfoCard from "./layout/InfoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { Statistic } from "antd";

type Props = {};
const formatter = (value: any) => <CountUp end={value} separator="," />;

const TopCustomers = (props: Props) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["topCustomers"],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`statistics/topCustomers`)
        .then((response) => response.data.topCustomers);
    },
    initialData: [],
  });

  return (
    <div className="flex-1  gap-3  py-4 bg-white rounded-lg ">
      <span className="text-gray-500 font-bold text-lg px-6">
        Top 10 Customers
      </span>
      <div className="flex flex-col mt-5 ">
        <div className="flex flex-row items-center py-2 px-6 bg-gray-100">
          <div className="w-2/12 flex justify-start">#</div>
          <div className="w-4/12 flex justify-center">Name</div>
          <div className="w-3/12 flex justify-center">type</div>
          <div className="w-3/12 flex justify-end">orders</div>
        </div>
        {data.map((el: any, i: number) => {
          return (
            <div key={i} className="flex flex-row items-center py-2 px-6">
              <div className="w-2/12 flex justify-start">{i + 1}</div>
              <div className="w-4/12 flex justify-center">{el.name}</div>
              <div className="w-3/12 flex justify-center">
                <span className={`flex items-center justify-center px-2 py-1 ${(el.type == 'Male' || el.type == 'Female') ? "bg-success" : 'bg-danger'}  text-white rounded-md`}>{el.type}</span>
              </div>
              <div className="w-3/12 flex justify-end">{el._count.orders}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCustomers;
