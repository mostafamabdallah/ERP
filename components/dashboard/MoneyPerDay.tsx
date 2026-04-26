import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { customFetch } from "@/utilities/fetch";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedMonth: any;
};

const MoneyPerDay = (props: Props) => {
  const { t } = useLanguage();
  const { data = [], isLoading } = useQuery({
    queryKey: ["moneyPerDay", props.selectedMonth],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(
          `statistics/moneyPerDay?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
        )
        .then((response) => response.data.moneyPerDay);
    },
    initialData: [],
  });

  return (
    <div className="flex gap-5 ">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white dark:bg-surface-mid rounded-lg w-full transition-colors duration-300">
        <span className="text-gray-500 dark:text-on-surface-variant font-bold text-lg">
          {t.dashboard.moneyPerDay}
        </span>
        {!isLoading && (
          <CustomLine
            dataSet={[
              {
                label: t.dashboard.moneyPerDayDataset,
                data: data.map((el: any) => {
                  return el.cost;
                }),
                borderColor: "#FA383E",
                backgroundColor: "#FA383E20",
              },
            ]}
            labels={data.map((el: any) => {
              return moment(el.date).format("YYYY-MM-DD");
            })}
          ></CustomLine>
        )}
      </div>
    </div>
  );
};

export default MoneyPerDay;
