import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { CustomBar } from "../charts/CustomBar";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedMonth: any;
};

const OrdersPerHour = (props: Props) => {
  const { t } = useLanguage();

  const { data = [], isLoading } = useQuery({
    queryKey: ["ordersPerHour", props.selectedMonth],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(
          `statistics/ordersPerHour?year=${props.selectedMonth?.year ?? ""}&month=${props.selectedMonth?.month ?? ""}`
        )
        .then((response) => response.data.ordersPerHour);
    },
    initialData: [],
  });

  // Shift UTC hours to browser local time so the chart matches what the
  // orders table column displays (both use the browser's timezone).
  const { labels, counts } = useMemo(() => {
    const localOffsetHours = -new Date().getTimezoneOffset() / 60; // e.g. +3 for UTC+3
    const buckets = new Array(24).fill(0);

    (data as { hour: number; order_count: string }[]).forEach((row) => {
      const localHour = ((Number(row.hour) + localOffsetHours) % 24 + 24) % 24;
      buckets[localHour] += Number(row.order_count);
    });

    const lbls = Array.from({ length: 24 }, (_, i) => {
      const h = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? "AM" : "PM";
      return `${h} ${ampm}`;
    });

    return { labels: lbls, counts: buckets };
  }, [data]);

  return (
    <div className="flex gap-5 flex-1 self-stretch">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg w-full transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.ordersPerHour}
        </span>
        {!isLoading && (
          <CustomBar
            dataSet={[
              {
                label: t.dashboard.ordersPerHourDataset,
                data: counts,
                borderColor: "#fcdc00",
                backgroundColor: "#fcdc0080",
              },
            ]}
            labels={labels}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPerHour;
