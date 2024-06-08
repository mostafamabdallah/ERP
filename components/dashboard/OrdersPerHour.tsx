import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";
import { CustomBar } from "../charts/CustomBar";

type Props = {
  selectedMonth:any
};
const OrdersPerHour = (props: Props) => {
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
      <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg w-full">
        <span className="text-gray-500 font-bold text-lg">Orders per Hour</span>
        {!isLoading && (
          <CustomBar
            dataSet={[
              {
                label: "Orders Per Hour",
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
