import React from "react";
import { CustomLine } from "../charts/CustomLine";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";

type Props = {};

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
    <div className="flex gap-5 ">
      <div className="flex flex-col gap-3 px-6 py-4 bg-white rounded-lg w-full">
        <span className="text-gray-500 font-bold text-lg">Orders per Hour</span>
        {!isLoading && (
          <CustomLine
            dataSet={[
              {
                label: "Orders Per Hour",
                data: data,
                borderColor: "#542582",
                backgroundColor: "#54258260",
              },
            ]}
            labels={data.map((el: any) => {
              return moment(el.hour).format('h A');
            })}
            data={data.map((el: any) => {
              return el.order_count;
            })}
          ></CustomLine>
        )}
      </div>
    </div>
  );
};

export default OrdersPerHour;
