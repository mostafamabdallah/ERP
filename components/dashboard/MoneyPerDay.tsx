import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { customFetch } from "@/utilities/fetch";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

type Props = {
  selectedMonth: any;
};
const MoneyPerDay = (props: Props) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["moneyPerDay",props.selectedMonth],
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
      <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg w-full">
        <span className="text-gray-500 font-bold text-lg">Money Per Day</span>
        {!isLoading && (
          <CustomLine
            dataSet={[
              {
                label: "Money Per Days",
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
