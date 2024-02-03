"use client";
import CountUp from "react-countup";
import { CustomLine } from "@/components/charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { CustomDoughnut } from "@/components/charts/CustomDoughnut";
export default function Home() {
  const formatter = (value: any) => <CountUp end={value} separator="," />;
  const { data } = useQuery({
    queryKey: ["ordersPerDay"],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`statistics/orders`)
        .then((response) => response.data.ordersPerDay);
    },
    initialData: [],
  });

  return (
    <main className="flex flex-col  justify-between w-full">
      <div className="flex gap-5 ">
        <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg flex-[3]">
          <span className="text-gray-500 font-bold text-lg">Orders</span>
          <CustomLine
            labels={data.map((el: any) => {
              return el.day;
            })}
            data={data.map((el: any) => {
              return el.orderCount;
            })}
          ></CustomLine>
        </div>
        <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg flex-[1]">
          <span className="text-gray-500 font-bold text-lg">Target</span>
          <CustomDoughnut></CustomDoughnut>
        </div>
      </div>
    </main>
  );
}
