"use client";
import { customFetch } from "@/utilities/fetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const OrderStatus = ({ status, id }: any) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const items = [
    { key: "pending", label: t.orders.pending },
    { key: "delivered", label: t.orders.delivered },
    { key: "collected", label: t.orders.collected },
    { key: "failed", label: t.orders.failed },
  ];

  const statusLabelMap: Record<string, string> = {
    pending: t.orders.pending,
    delivered: t.orders.delivered,
    collected: t.orders.collected,
    failed: t.orders.failed,
    success: t.orders.success,
    money_collected: t.orders.moneyCollected,
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post(`/orders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    },
  });

  const colorClass =
    status == "success" || status == "collected" || status == "money_collected"
      ? "text-[#8cbfad]"
      : status == "pending"
      ? "text-[#a3965f]"
      : status == "delivered"
      ? "text-[#542582]"
      : "text-[#ff9398]";

  const bgClass =
    status == "success" || status == "collected"
      ? "bg-[#8cbfad20]"
      : status == "pending"
      ? "bg-[#a3965f20]"
      : status == "delivered"
      ? "bg-[#54258220]"
      : "bg-[#ff939820]";

  return (
    <Dropdown.Button
      className={`w-fit ${bgClass}`}
      loading={mutation.isPending}
      disabled={mutation.isPending}
      menu={{
        items,
        onClick: async (e) => {
          const data: any = { id, status: e.key };
          try {
            await mutation.mutateAsync(data);
          } catch (error: any) {
            message.error(error.response.data.message).then(() => {
              push(`/orders`);
            });
          }
        },
      }}
    >
      <span
        className={`${colorClass} transition-opacity duration-200 ${
          mutation.isPending ? "opacity-40" : "opacity-100"
        }`}
      >
        {statusLabelMap[status] ?? status}
      </span>
    </Dropdown.Button>
  );
};

export default OrderStatus;
