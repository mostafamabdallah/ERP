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
    <>
      <span className="text-gray-500 font-bold text-lg">Top 10 Customers</span>
      <div className="flex gap-5 flex-wrap ">
        {data.map((el: any, i: number) => {
          return (
            <div
              key={i}
              className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg  "
            >
              <div className="flex justify-start gap-3 items-center">
                <div
                  className={`flex justify-center items-center  rounded-full w-9 h-9`}
                >
                  <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                </div>
                <span className="font-bold text-lg ">
                  {el.name}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3 text-primary">
                <span className="text-tittle  text-3xl font-bold ">
                  <Statistic  className=""
                    value={el["_count"]?.orders}
                    formatter={formatter}
                    suffix="orders"
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TopCustomers;
