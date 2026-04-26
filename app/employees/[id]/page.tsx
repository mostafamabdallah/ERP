"use client";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { Button, DatePicker, Table, Progress } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import CountUp from "react-countup";
import {
  faBoxOpen,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faMoneyBillWave,
  faStar,
  faPhone,
  faBriefcase,
  faTrophy,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "@/contexts/LanguageContext";
import moment from "moment";
import OrderStatus from "@/app/orders/components/OrderStatus";

const { MonthPicker } = DatePicker;

interface SelectedMonth {
  month: number;
  year: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  suffix?: string;
  decimals?: number;
}

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  suffix = "",
  decimals = 0,
}: StatCardProps) => (
  <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg transition-colors duration-300">
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
    <span className="text-3xl font-bold text-tittle dark:text-on-surface">
      <CountUp end={value} separator="," decimals={decimals} />
      {suffix}
    </span>
  </div>
);

const Page = ({ params }: { params: { id: string } }) => {
  const { t } = useLanguage();
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const handleMonthChange = (date: any) => {
    if (date) {
      setSelectedMonth({ month: date.month() + 1, year: date.year() });
    } else {
      setSelectedMonth({ month: 0, year: currentDate.getFullYear() });
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["employee_stats", params.id, selectedMonth.month, selectedMonth.year],
    queryFn: () =>
      customFetch
        .get(
          `employees/${params.id}/stats?month=${selectedMonth.month}&year=${selectedMonth.year}`
        )
        .then((r) => r.data),
    initialData: {
      employee: null,
      stats: {
        totalOrders: 0,
        deliveredOrders: 0,
        failedOrders: 0,
        pendingOrders: 0,
        totalDeliveryMoney: 0,
        avgDeliveryMoney: 0,
        avgOrdersPerDay: 0,
        successRate: 0,
      },
      orders: [],
    },
  });

  const { employee, stats, orders } = data;

  const getPerformanceGrade = (rate: number) => {
    if (rate >= 85)
      return { label: t.employees.excellent, color: "#22c55e", bg: "#22c55e20" };
    if (rate >= 70)
      return { label: t.employees.good, color: "#3b82f6", bg: "#3b82f620" };
    if (rate >= 50)
      return { label: t.employees.average, color: "#f59e0b", bg: "#f59e0b20" };
    return { label: t.employees.poor, color: "#ef4444", bg: "#ef444420" };
  };

  const grade = getPerformanceGrade(stats.successRate);

  const jobLabelMap: Record<string, string> = {
    delivery: t.employees.jobDelivery,
    manger: t.employees.jobManager,
    "call center": t.employees.jobCallCenter,
  };

  const statCards = [
    {
      title: t.employees.totalOrders,
      value: stats.totalOrders,
      icon: faBoxOpen,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
    },
    {
      title: t.employees.deliveredOrders,
      value: stats.deliveredOrders,
      icon: faCheckCircle,
      iconColor: "text-[#22c55e]",
      iconBgColor: "bg-[#22c55e20]",
    },
    {
      title: t.employees.failedOrders,
      value: stats.failedOrders,
      icon: faTimesCircle,
      iconColor: "text-[#ef4444]",
      iconBgColor: "bg-[#ef444420]",
    },
    {
      title: t.employees.pendingOrders,
      value: stats.pendingOrders,
      icon: faClock,
      iconColor: "text-[#f59e0b]",
      iconBgColor: "bg-[#f59e0b20]",
    },
    {
      title: t.employees.totalDeliveryMoney,
      value: stats.totalDeliveryMoney,
      icon: faMoneyBillWave,
      iconColor: "text-[#8b5cf6]",
      iconBgColor: "bg-[#8b5cf620]",
    },
    {
      title: t.employees.avgOrdersPerDay,
      value: stats.avgOrdersPerDay,
      icon: faChartLine,
      iconColor: "text-[#06b6d4]",
      iconBgColor: "bg-[#06b6d420]",
      decimals: 1,
    },
  ];

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
      render: (cost: number) => cost?.toFixed(2),
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
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header: employee info + month picker */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-surface-mid rounded-lg px-6 py-5">
        <div className="flex gap-4 items-center">
          <Avatar
            size={72}
            icon={<UserOutlined />}
            className="bg-primary shrink-0"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-primary dark:text-primary-dark">
              {employee?.name ?? "—"}
            </p>
            <p className="flex gap-2 items-center text-sm text-gray-500 dark:text-on-surface-variant">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-primary dark:text-primary-dark w-3"
              />
              {employee?.phone}
            </p>
            <p className="flex gap-2 items-center text-sm text-gray-500 dark:text-on-surface-variant">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-primary dark:text-primary-dark w-3"
              />
              {jobLabelMap[employee?.job] ?? employee?.job}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MonthPicker
            onChange={handleMonthChange}
            value={
              selectedMonth.month !== 0
                ? moment(
                    `${selectedMonth.year}-${selectedMonth.month}`,
                    "YYYY-M"
                  )
                : null
            }
            className="min-w-[160px]"
          />
          <Button
            type={selectedMonth.month === 0 ? "primary" : "default"}
            onClick={() =>
              setSelectedMonth({ month: 0, year: currentDate.getFullYear() })
            }
          >
            {t.employees.allTime}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Performance section */}
      <div className="bg-white dark:bg-surface-mid rounded-lg px-6 py-5 flex flex-col gap-5">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-[#f59e0b20] rounded-full w-9 h-9 shrink-0">
            <FontAwesomeIcon icon={faStar} className="text-[#f59e0b]" />
          </div>
          <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
            {t.employees.performance}
          </span>
          <span
            className="ms-auto px-4 py-1 rounded-full text-sm font-bold"
            style={{ color: grade.color, backgroundColor: grade.bg }}
          >
            {grade.label}
          </span>
        </div>

        {/* Progress bar */}
        <Progress
          percent={stats.successRate}
          strokeColor={grade.color}
          trailColor="#e5e7eb"
          strokeWidth={14}
          format={(pct) => (
            <span style={{ color: grade.color }} className="font-bold">
              {pct}%
            </span>
          )}
        />

        {/* Three sub-metrics */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 text-center">
          <div className="flex flex-col items-center gap-1 px-4">
            <span
              className="text-2xl font-bold"
              style={{ color: grade.color }}
            >
              <CountUp end={stats.successRate} suffix="%" />
            </span>
            <span className="text-xs text-gray-400 dark:text-on-surface-variant">
              {t.employees.successRate}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-2xl font-bold text-tittle dark:text-on-surface">
              <CountUp
                end={stats.avgDeliveryMoney}
                decimals={1}
                separator=","
              />
            </span>
            <span className="text-xs text-gray-400 dark:text-on-surface-variant">
              {t.employees.avgDeliveryMoney}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-[#f59e0b] text-lg"
              />
              <span className="text-2xl font-bold text-tittle dark:text-on-surface">
                <CountUp end={stats.deliveredOrders} />
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-on-surface-variant">
              {t.employees.deliveredOrders}
            </span>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-surface-mid rounded-lg px-4 py-5">
        <p className="text-lg font-bold text-tittle dark:text-on-surface mb-4">
          {t.employees.monthlyOrders}
        </p>
        <Table
          columns={columns}
          dataSource={orders}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};

export default Page;
