import React from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import { CustomBar } from "../charts/CustomBar";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedMonth: any;
};

const OrdersPerHour = (props: Props) => {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["ordersPerHour"],
    queryFn: (): Promise<any> => {
      return customFetch.get(`statistics/ordersPerHour`).then((response) => {
        return response.data.ordersPerHour;
      });
    },
    initialData: [],
  });

  return (
    <div className="flex gap-5 flex-1">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg w-full transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.ordersPerHour}
        </span>
        {!isLoading && (
          <CustomBar
            dataSet={[
              {
                label: t.dashboard.ordersPerHourDataset,
                data: data.map((el: any) => {
                  return el.order_count;
                }),
                borderColor: "#fcdc00",
                backgroundColor: "#fcdc0080",
              },
            ]}
            labels={data.map((el: any) => {
              return el.hour;
            })}
          ></CustomBar>
        )}
      </div>
    </div>
  );
};

export default OrdersPerHour;
