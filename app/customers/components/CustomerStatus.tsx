"use client";
import { customFetch } from "@/utilities/fetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, message } from "antd";
import React from "react";

const CustomerStatus = ({ status, id }: any) => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const items = [
    { key: "verified", label: t.customers.verified },
    { key: "warned", label: t.customers.warned },
    { key: "blocked", label: t.customers.blocked },
  ];

  const statusLabelMap: Record<string, string> = {
    verified: t.customers.verified,
    warned: t.customers.warned,
    blocked: t.customers.blocked,
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post(`/customers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return (
    <Dropdown.Button
      className={`w-fit ${
        status == "verified"
          ? "bg-[#8cbfad20]"
          : status == "warned"
          ? "bg-[#a3965f20]"
          : "bg-[#ff939820]"
      } `}
      menu={{
        items,
        onClick: async (e) => {
          const data: any = { id, status: e.key };
          try {
            await mutation.mutateAsync(data);
          } catch (error: any) {
            message.error(error.response.data.message).then(() => {});
          }
        },
      }}
    >
      <span
        className={`${
          status == "verified"
            ? "text-[#8cbfad]"
            : status == "warned"
            ? "text-[#a3965f]"
            : "text-[#ff9398]"
        } `}
      >
        {statusLabelMap[status] ?? status}
      </span>
    </Dropdown.Button>
  );
};

export default CustomerStatus;
