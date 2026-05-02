"use client";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Skeleton, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { customFetch } from "@/utilities/fetch";
import InfoCard from "@/components/layout/InfoCard";
import { CustomBar } from "@/components/charts/CustomBar";
import OrderTable from "@/components/OrderTable";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  faBoxOpen,
  faChartLine,
  faMoneyBillWave,
  faScaleBalanced,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DailyStats {
  stats: {
    total: number;
    delivered: number;
    collected: number;
    pending: number;
    failed: number;
  };
  revenue: number;
  expenses: number;
  netProfit: number;
  orders: any[];
}

const statusConfig = [
  {
    key: "delivered",
    labelAr: "مسلّمة",
    labelEn: "Delivered",
    icon: faCheckCircle,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
  },
  {
    key: "collected",
    labelAr: "محصّلة",
    labelEn: "Collected",
    icon: faHandHoldingDollar,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    key: "pending",
    labelAr: "معلّقة",
    labelEn: "Pending",
    icon: faClock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    key: "failed",
    labelAr: "فاشلة",
    labelEn: "Failed",
    icon: faTimesCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
  },
];

export default function DailyStatsPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const dateStr = selectedDate.format("YYYY-MM-DD");

  const { data, isLoading } = useQuery<DailyStats>({
    queryKey: ["dailyStats", dateStr],
    queryFn: async () => {
      const res = await customFetch.get(`statistics/daily?date=${dateStr}`);
      return res.data;
    },
  });

  const isToday = selectedDate.isSame(dayjs(), "day");

  const kpiCards = [
    {
      title: isAr ? "إجمالي الطلبات" : "Total Orders",
      icon: faBoxOpen,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: data?.stats.total ?? 0,
      isCurrency: false,
    },
    {
      title: isAr ? "إجمالي الإيرادات" : "Total Revenue",
      icon: faChartLine,
      iconColor: "text-[#f59e0b]",
      iconBgColor: "bg-[#f59e0b20]",
      value: data?.revenue ?? 0,
      isCurrency: true,
    },
    {
      title: isAr ? "إجمالي المصروفات" : "Total Expenses",
      icon: faMoneyBillWave,
      iconColor: "text-[#ef4444]",
      iconBgColor: "bg-[#ef444420]",
      value: data?.expenses ?? 0,
      isCurrency: true,
    },
    {
      title: isAr ? "صافي الربح" : "Net Profit",
      icon: faScaleBalanced,
      iconColor: "text-[#22c55e]",
      iconBgColor: "bg-[#22c55e20]",
      value: data?.netProfit ?? 0,
      isCurrency: true,
      isProfit: true,
    },
  ];

  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return `${h} ${ampm}`;
  });

  // Compute per-hour counts from the orders' createdAt field directly in the
  // browser. dayjs() reads the browser's local timezone — the same source the
  // orders table column uses — so the chart always agrees with the table.
  const hourCounts = useMemo(() => {
    const counts = new Array(24).fill(0);
    (data?.orders ?? []).forEach((order) => {
      const hour = dayjs(order.createdAt).hour();
      counts[hour]++;
    });
    return counts;
  }, [data?.orders]);

  const hasAnyOrders = hourCounts.some((c) => c > 0);

  return (
    <main className="flex flex-col w-full gap-5 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-tittle dark:text-on-surface">
            {isAr ? "الإحصائيات اليومية" : "Daily Statistics"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-on-surface-variant">
            {isAr
              ? "عرض تفصيلي لأداء يوم محدد"
              : "Detailed breakdown for a specific day"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isToday && (
            <Tag color="blue" className="text-sm font-semibold px-3 py-1">
              {isAr ? "اليوم" : "Today"}
            </Tag>
          )}
          <DatePicker
            value={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            disabledDate={(d) => d.isAfter(dayjs(), "day")}
            format="YYYY-MM-DD"
            allowClear={false}
            size="large"
          />
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex gap-5 flex-wrap flex-1 md:flex-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Input key={i} active block style={{ height: 100, borderRadius: 8 }} />
          ))}
        </div>
      ) : (
        <div className="flex gap-5 flex-wrap flex-1 md:flex-nowrap">
          {kpiCards.map((card, i) => (
            <InfoCard key={i} data={card} />
          ))}
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusConfig.map((s) => {
          const count =
            data?.stats[s.key as keyof typeof data.stats] ?? 0;
          const total = data?.stats.total || 1;
          const pct = Math.round((count / total) * 100);

          return (
            <div
              key={s.key}
              className={`flex flex-col gap-2 px-5 py-4 rounded-lg border transition-colors duration-300 ${s.bg} ${s.border}`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={s.icon}
                  className={`${s.color} text-lg`}
                />
                <span className="text-sm font-semibold text-gray-600 dark:text-on-surface-variant">
                  {isAr ? s.labelAr : s.labelEn}
                </span>
              </div>
              <span className="text-3xl font-bold text-tittle dark:text-on-surface">
                {isLoading ? <Skeleton.Input active style={{ width: 60, height: 36 }} /> : count}
              </span>
              {!isLoading && data?.stats.total ? (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      s.key === "delivered"
                        ? "bg-green-500"
                        : s.key === "collected"
                        ? "bg-blue-500"
                        : s.key === "pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ) : null}
              {!isLoading && data?.stats.total ? (
                <span className="text-xs text-gray-400">{pct}%</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Orders Per Hour Chart */}
      <div className="flex flex-col gap-3 px-6 py-5 bg-white dark:bg-surface-mid rounded-lg shadow-sm transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {isAr ? "الطلبات بالساعة" : "Orders per Hour"}
        </span>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : hasAnyOrders ? (
          <CustomBar
            labels={hourLabels}
            height="130px"
            dataSet={[
              {
                label: isAr ? "عدد الطلبات" : "Order Count",
                data: hourCounts,
                borderColor: "#0f62fe",
                backgroundColor: "#0f62fe50",
                borderRadius: 4,
              },
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400 dark:text-on-surface-variant">
            {isAr ? "لا توجد طلبات في هذا اليوم" : "No orders for this day"}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="flex flex-col gap-3 px-6 py-5 bg-white dark:bg-surface-mid rounded-lg shadow-sm transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {isAr ? "طلبات اليوم" : "Orders for the Day"}
          {data?.stats.total !== undefined && (
            <span className="ms-2 text-base font-normal text-primary dark:text-primary-dark">
              ({data.stats.total})
            </span>
          )}
        </span>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <OrderTable orders={data?.orders ?? []} />
        )}
      </div>
    </main>
  );
}
