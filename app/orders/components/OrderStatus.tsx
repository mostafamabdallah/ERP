import { customFetch } from "@/utilities/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
type Props = {};
const items = [
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "success",
    label: "success",
  },
  {
    key: "failed",
    label: "Failed",
  },
];
const OrderStatus = ({ status, id }: any) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post(`/orders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <Dropdown.Button
      className={`w-fit ${
        status == "success"
          ? "bg-[#8cbfad20]"
          : status == "pending"
          ? "bg-[#a3965f20]"
          : "bg-[#ff939820]"
      } `}
      menu={{
        items,
        onClick: async (e) => {
          const data: any = {
            id: id,
            status: e.key,
          };
          try {
            await mutation.mutateAsync(data).then((data) => {});
          } catch (error: any) {
            message.error(error.response.data.message).then(() => {
              push(`/orders`);
            });          }
        },
      }}
    >
      <span
        className={`capitalize ${
          status == "success"
            ? "text-[#8cbfad]"
            : status == "pending"
            ? "text-[#a3965f]"
            : "text-[#ff9398]"
        } `}
      >
        {status}
      </span>
    </Dropdown.Button>
  );
};

export default OrderStatus;
