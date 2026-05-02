"use client";
import InfoCard from "@/components/layout/InfoCard";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import {
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Order } from "../../types/global";
import React, { useState } from "react";
import Link from "next/link";
import OrderTable from "../../components/OrderTable";
import { useLanguage } from "@/contexts/LanguageContext";

type OrdersResponse = {
  orders: Order[];
  total: number;
  stats: {
    total: number;
    delivered: number;
    pending: number;
    failed: number;
  };
};

const INITIAL_DATA: OrdersResponse = {
  orders: [],
  total: 0,
  stats: { total: 0, delivered: 0, pending: 0, failed: 0 },
};

const Page = () => {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["orders", page, pageSize, search],
    queryFn: (): Promise<OrdersResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (search) params.set("search", search);
      return customFetch
        .get(`orders?${params.toString()}`)
        .then((response) => response.data);
    },
    initialData: INITIAL_DATA,
    placeholderData: (prev) => prev,
  });

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const dashboardData = [
    {
      title: t.orders.totalOrders,
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: data.stats.total,
      delta: 100,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.deliveredOrders,
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: data.stats.delivered,
      delta: 5,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.pendingOrders,
      icon: faExclamationCircle,
      iconColor: "text-[#a3965f]",
      iconBgColor: "bg-[#a3965f20]",
      value: data.stats.pending,
      delta: 15,
      currency: "users",
      period: t.dashboard.week,
    },
    {
      title: t.orders.failedOrders,
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: data.stats.failed,
      delta: 1,
      currency: "users",
      period: t.dashboard.week,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-end">
        <Link
          href="/customers/new"
          className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
        >
          <FontAwesomeIcon className="font-bold" icon={faPlus} />
          {t.common.addNew}
        </Link>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardData.map((el, i) => (
          <InfoCard key={i} data={el} />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-6">
        <div className="w-full">
          <OrderTable
            orders={data.orders}
            total={data.total}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            loading={isFetching}
          />
        </div>
        <div className="w-full lg:w-4/12 bg-white dark:bg-surface-mid rounded-md flex-1"></div>
      </div>
    </div>
  );
};

export default Page;
