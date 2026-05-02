"use client";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { Button, DatePicker, Skeleton, Tag, Table } from "antd";
import { useState, useMemo } from "react";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import CountUp from "react-countup";
import {
  faBoxOpen,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faMoneyBillWave,
  faPercent,
  faPhone,
  faBriefcase,
  faHandHoldingDollar,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "@/contexts/LanguageContext";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import OrderStatus from "@/app/orders/components/OrderStatus";
import { CustomBar } from "@/components/charts/CustomBar";
import moment from "moment";

interface DailyDeliveryStats {
  employee: {
    id: number;
    name: string;
    phone: string;
    job: string;
    commission: number;
  } | null;
  stats: {
    totalOrders: number;
    deliveredOrders: number;
    failedOrders: number;
    pendingOrders: number;
    totalDeliveryMoney: number;
    successRate: number;
    commissionEarnings: number;
    commissionRate: number;
  };
  orders: any[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  suffix?: string;
  decimals?: number;
  highlight?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  suffix = "",
  decimals = 0,
  highlight = false,
}: StatCardProps) => (
  <div
    className={`flex flex-col gap-3 px-6 py-4 rounded-lg transition-colors duration-300 ${
      highlight
        ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700"
        : "bg-white dark:bg-surface-mid"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center ${iconBgColor} rounded-full w-9 h-9 shrink-0`}
      >
        <FontAwesomeIcon icon={icon} className={iconColor} />
      </div>
      <span className="text-gray-500 dark:text-on-surface-variant font-bold text-sm leading-tight">
        {title}
      </span>
    </div>
    <span
      className={`text-3xl font-bold ${
        highlight ? "text-[#f97316]" : "text-tittle dark:text-on-surface"
      }`}
    >
      <CountUp end={value} separator="," decimals={decimals} />
      {suffix}
    </span>
  </div>
);

const statusConfig = [
  {
    key: "deliveredOrders",
    labelAr: "مسلّمة",
    labelEn: "Delivered",
    icon: faCheckCircle,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    barColor: "bg-green-500",
  },
  {
    key: "pendingOrders",
    labelAr: "معلّقة",
    labelEn: "Pending",
    icon: faClock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    barColor: "bg-amber-500",
  },
  {
    key: "failedOrders",
    labelAr: "فاشلة",
    labelEn: "Failed",
    icon: faTimesCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    barColor: "bg-red-500",
  },
];

const Page = ({ params }: { params: { id: string } }) => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const dateStr = selectedDate.format("YYYY-MM-DD");
  const isToday = selectedDate.isSame(dayjs(), "day");

  const { data, isLoading } = useQuery<DailyDeliveryStats>({
    queryKey: ["employee_daily", params.id, dateStr],
    queryFn: () =>
      customFetch
        .get(`employees/${params.id}/daily?date=${dateStr}`)
        .then((r) => r.data),
  });

  const { employee, stats, orders } = data ?? {
    employee: null,
    stats: {
      totalOrders: 0,
      deliveredOrders: 0,
      failedOrders: 0,
      pendingOrders: 0,
      totalDeliveryMoney: 0,
      successRate: 0,
      commissionEarnings: 0,
      commissionRate: 30,
    },
    orders: [],
  };

  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return `${h} ${ampm}`;
  });

  const hourCounts = useMemo(() => {
    const counts = new Array(24).fill(0);
    (orders ?? []).forEach((order) => {
      const hour = dayjs(order.createdAt).hour();
      counts[hour]++;
    });
    return counts;
  }, [orders]);

  const hasAnyOrders = hourCounts.some((c) => c > 0);

  const columns = [
    {
      title: t.common.id,
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: t.orders.customerName,
      dataIndex: ["customer", "name"],
      key: "customerName",
    },
    {
      title: t.common.address,
      dataIndex: ["customer", "address"],
      key: "address",
    },
    {
      title: t.orders.deliveryCost,
      dataIndex: "deliveryCost",
      key: "deliveryCost",
      render: (cost: number) => `${cost?.toFixed(2)} ج.م`,
    },
    {
      title: isAr ? "عمولتي" : "My Commission",
      key: "myCommission",
      render: (_: any, record: any) => (
        <span className="font-semibold text-[#f97316]">
          {((record.deliveryCost * (stats?.commissionRate ?? 30)) / 100).toFixed(2)} ج.م
        </span>
      ),
    },
    {
      title: t.common.status,
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <OrderStatus status={status} id={record.id} />
      ),
    },
    {
      title: t.common.date,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("hh:mm A"),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-surface-mid rounded-lg px-6 py-5">
        <div className="flex gap-4 items-center">
          <Link href={`/employees/${params.id}`}>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              className="text-primary"
            />
          </Link>
          <Avatar size={64} icon={<UserOutlined />} className="bg-primary shrink-0" />
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <Skeleton.Input active style={{ width: 160, height: 24 }} />
            ) : (
              <>
                <p className="text-xl font-bold text-primary dark:text-primary-dark">
                  {employee?.name ?? "—"}
                </p>
                <p className="flex gap-2 items-center text-sm text-gray-500 dark:text-on-surface-variant">
                  <FontAwesomeIcon icon={faPhone} className="text-primary w-3" />
                  {employee?.phone}
                </p>
                <p className="flex gap-2 items-center text-sm text-gray-500 dark:text-on-surface-variant">
                  <FontAwesomeIcon icon={faPercent} className="text-[#f97316] w-3" />
                  <span className="font-semibold text-[#f97316]">
                    {employee?.commission ?? 30}%
                  </span>
                  <span>{t.employees.commission}</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Title */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-bold text-tittle dark:text-on-surface">
          {t.employees.dailyStats}
        </h1>
        <p className="text-sm text-gray-500 dark:text-on-surface-variant">
          {dateStr}
        </p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Input key={i} active block style={{ height: 110, borderRadius: 8 }} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t.employees.totalOrders}
            value={stats.totalOrders}
            icon={faBoxOpen}
            iconColor="text-[#0f62fe]"
            iconBgColor="bg-[#0f62fe20]"
          />
          <StatCard
            title={t.employees.totalDeliveryMoney}
            value={stats.totalDeliveryMoney}
            icon={faMoneyBillWave}
            iconColor="text-[#8b5cf6]"
            iconBgColor="bg-[#8b5cf620]"
            decimals={2}
            suffix=" ج.م"
          />
          <StatCard
            title={t.employees.commissionEarnings}
            value={stats.commissionEarnings}
            icon={faHandHoldingDollar}
            iconColor="text-[#f97316]"
            iconBgColor="bg-[#f9731620]"
            decimals={2}
            suffix=" ج.م"
            highlight
          />
          <StatCard
            title={isAr ? "نسبة النجاح" : "Success Rate"}
            value={stats.successRate}
            icon={faChartBar}
            iconColor="text-[#22c55e]"
            iconBgColor="bg-[#22c55e20]"
            suffix="%"
          />
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {statusConfig.map((s) => {
          const count = stats[s.key as keyof typeof stats] as number ?? 0;
          const total = stats.totalOrders || 1;
          const pct = Math.round((count / total) * 100);

          return (
            <div
              key={s.key}
              className={`flex flex-col gap-2 px-5 py-4 rounded-lg border transition-colors duration-300 ${s.bg} ${s.border}`}
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={s.icon} className={`${s.color} text-lg`} />
                <span className="text-sm font-semibold text-gray-600 dark:text-on-surface-variant">
                  {isAr ? s.labelAr : s.labelEn}
                </span>
              </div>
              <span className="text-3xl font-bold text-tittle dark:text-on-surface">
                {isLoading ? (
                  <Skeleton.Input active style={{ width: 60, height: 36 }} />
                ) : (
                  count
                )}
              </span>
              {!isLoading && stats.totalOrders ? (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${s.barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              ) : null}
              {!isLoading && stats.totalOrders ? (
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
          <Skeleton active paragraph={{ rows: 5 }} />
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
      <div className="bg-white dark:bg-surface-mid rounded-lg px-4 py-5">
        <p className="text-lg font-bold text-tittle dark:text-on-surface mb-4">
          {t.employees.dailyOrders}
          {stats.totalOrders > 0 && (
            <span className="ms-2 text-base font-normal text-primary dark:text-primary-dark">
              ({stats.totalOrders})
            </span>
          )}
        </p>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: true }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
