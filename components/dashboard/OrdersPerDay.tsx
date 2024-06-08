import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";

type Props = {
  selectedMonth: any;
};
const OrdersPerDay = (props: Props) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["ordersPerDay", props.selectedMonth],
    queryFn: (): Promise<any> => {
      if (props.selectedMonth.year) {
        return customFetch
          .get(
            `statistics/ordersPerDay?year=${props.selectedMonth.year}&month=${props.selectedMonth.month}`
          )
          .then((response) => response.data.ordersPerDay);
      } else {
        return customFetch
          .get(`statistics/ordersPerDay`)
          .then((response) => response.data.ordersPerDay);
      }
    },
  });
  return (
    <div className="flex gap-5 ">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg w-full">
        <span className="text-gray-500 font-bold text-lg">Orders</span>
        {!isLoading && (
          <CustomLine
            dataSet={[
              {
                label: "Orders Per Days",
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
