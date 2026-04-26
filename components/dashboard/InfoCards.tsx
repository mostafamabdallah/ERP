import { customFetch } from "@/utilities/fetch";
import {
  faBoxOpen,
  faChartLine,
  faMoneyBillWave,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import InfoCard from "../layout/InfoCard";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedMonth: any;
};

const InfoCards = (props: Props) => {
  const { t } = useLanguage();

  const totalOrdersQuery = useQuery({
    queryKey: ["totalOrders", props.selectedMonth],
    queryFn: async (): Promise<number> => {
      if (props.selectedMonth?.year) {
        const res = await customFetch.get(
          `statistics/ordersPerDay?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
        );
        const rows: any[] = res.data.ordersPerDay ?? [];
        return rows.reduce((sum: number, r: any) => sum + Number(r.order_count), 0);
      }
      const res = await customFetch.get("orders");
      return (res.data.orders ?? []).length;
    },
    initialData: 0,
  });

  const totalDeliveryMoney = useQuery({
    queryKey: ["deliveryMoney", props.selectedMonth],
    queryFn: (): Promise<number> => {
      if (props.selectedMonth?.year) {
        return customFetch
          .get(
            `statistics/totalDeliveryMoney?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
          )
          .then((res) => Number(res.data.totalDeliveryCost));
      }
      return customFetch
        .get(`statistics/totalDeliveryMoney`)
        .then((res) => Number(res.data.totalDeliveryCost));
    },
    initialData: 0,
  });

  const netProfit = useQuery({
    queryKey: ["netProfit", props.selectedMonth],
    queryFn: (): Promise<any> => {
      if (props.selectedMonth?.year) {
        return customFetch
          .get(
            `statistics/netProfit?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
          )
          .then((res) => res.data);
      }
      return customFetch.get(`statistics/netProfit`).then((res) => res.data);
    },
    initialData: { netProfit: 0, totalExpense: 0 },
  });

  const dashboardData = [
    {
      title: t.dashboard.totalOrders,
      icon: faBoxOpen,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: Number(totalOrdersQuery.data) || 0,
      isCurrency: false,
    },
    {
      title: t.dashboard.totalDeliveryMoney,
      icon: faChartLine,
      iconColor: "text-[#f59e0b]",
      iconBgColor: "bg-[#f59e0b20]",
      value: Number(totalDeliveryMoney.data) || 0,
      isCurrency: true,
    },
    {
      title: t.dashboard.totalExpenses,
      icon: faMoneyBillWave,
      iconColor: "text-[#ef4444]",
      iconBgColor: "bg-[#ef444420]",
      value: Number(netProfit.data?.totalExpense) || 0,
      isCurrency: true,
    },
    {
      title: t.dashboard.netProfit,
      icon: faScaleBalanced,
      iconColor: "text-[#22c55e]",
      iconBgColor: "bg-[#22c55e20]",
      value: Number(netProfit.data?.netProfit) || 0,
      isCurrency: true,
      isProfit: true,
    },
  ];

  return (
    <div className="flex gap-5 flex-wrap flex-1 md:flex-nowrap">
      {dashboardData.map((el, i) => (
        <InfoCard key={i} data={el} />
      ))}
    </div>
  );
};

export default InfoCards;
