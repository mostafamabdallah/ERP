import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedMonth: any;
};

const OrdersPerDay = (props: Props) => {
  const { t } = useLanguage();
  const { data = [], isLoading } = useQuery({
    queryKey: ["ordersPerDay", props.selectedMonth],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(
          `statistics/ordersPerDay?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
        )
        .then((response) => response.data.ordersPerDay);
    },
  });

  return (
    <div className="flex gap-5 ">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg w-full transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.ordersChart}
        </span>
        {!isLoading && (
          <CustomLine
            dataSet={[
              {
                label: t.dashboard.ordersPerDay,
                data: data.map((el: any) => {
                  return el.order_count;
                }),
                borderColor: "#542582",
                backgroundColor: "#54258260",
              },
            ]}
            labels={data.map((el: any) => {
              return moment(el.order_date).format("YYYY-MM-DD");
            })}
          ></CustomLine>
        )}
      </div>
    </div>
  );
};

export default OrdersPerDay;
