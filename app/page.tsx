"use client";
import CountUp from "react-countup";
import { CustomLine } from "@/components/charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { CustomDoughnut } from "@/components/charts/CustomDoughnut";
import { Customer, Order } from "@/types/global";
import {
  faBoxOpen,
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import InfoCard from "@/components/layout/InfoCard";
export default function Home() {
  const formatter = (value: any) => <CountUp end={value} separator="," />;
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ordersPerDay"],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`statistics/ordersPerDay`)
        .then((response) => response.data.ordersPerDay);
    },
    initialData: [],
  });

  const totalDeliveryMoney = useQuery({
    queryKey: ["deliveryMoney"],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`statistics/totalDeliveryMoney`)
        .then((response) => {
          return response.data.totalDeliveryCost;
        });
    },
    initialData: [],
  });


  const customers = useQuery({
    queryKey: ["customers"],
    queryFn: (): Promise<Customer[]> => {
      return customFetch
        .get("customers")
        .then((response) => response.data.customers);
    },
    initialData: [],
  });

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: (): Promise<Order[]> => {
      return customFetch.get("orders").then((response) => response.data.orders);
    },
    initialData: [],
  });

  const dashboardData = [
    {
      title: "Total Customers",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: customers.data.length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Total orders",
      icon: faBoxOpen,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: orders.data.length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Total Delivery Money",
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: Number(totalDeliveryMoney.data),
      delta: 15,
      currency: "users",
      period: "week",
    },

    {
      title: "Blocked Customers",
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: customers.data.filter((el) => {
        return el.status == "blocked";
      }).length,
      delta: 1,
      currency: "users",
      period: "week",
    },
  ];

  return (
    <main className="flex flex-col w-full gap-5">
      <div className="flex gap-5 ">
        {dashboardData.map((el, i) => {
          return <InfoCard key={i} data={el}></InfoCard>;
        })}
      </div>
      <div className="flex gap-5 ">
        <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg w-full">
          <span className="text-gray-500 font-bold text-lg">Orders</span>
          {!isLoading && (
            <CustomLine
              labels={data.map((el: any) => {
                return el.order_date;
              })}
              data={data.map((el: any) => {
                return el.order_count;
              })}
            ></CustomLine>
          )}
        </div>
      </div>
    </main>
  );
}
