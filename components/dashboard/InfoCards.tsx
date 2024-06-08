import { Customer, Order } from "@/types/global";
import { customFetch } from "@/utilities/fetch";
import {
  faBoxOpen,
  faExclamationCircle,
  faLock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import InfoCard from "../layout/InfoCard";

type Props = {
  selectedMonth: any;
};

const InfoCards = (props: Props) => {
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

  const totalDeliveryMoney = useQuery({
    queryKey: ["deliveryMoney", props.selectedMonth],
    queryFn: (): Promise<any> => {
      if (props.selectedMonth.year) {
        return customFetch
          .get(
            `statistics/totalDeliveryMoney?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
          )
          .then((response) => response.data.totalDeliveryCost);
      } else {
        return customFetch
          .get(`statistics/totalDeliveryMoney`)
          .then((response) => response.data.totalDeliveryCost);
      }
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
    <div className="flex gap-5 flex-wrap flex-1 md:flex-nowrap">
      {dashboardData.map((el, i) => {
        return <InfoCard key={i} data={el}></InfoCard>;
      })}
    </div>
  );
};

export default InfoCards;
