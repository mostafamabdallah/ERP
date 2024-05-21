import { customFetch } from "@/utilities/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown, message } from "antd";
import { useRouter } from "next/router";
import React from "react";
type Props = {};
const items = [
  {
    key: "verified",
    label: "Verified",
  },
  {
    key: "warned",
    label: "Warned",
  },
  {
    key: "blocked",
    label: "Blocked",
  },
];
const CustomerStatus = ({ status, id }: any) => {
  const queryClient = useQueryClient();
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
          const data: any = {
            id: id,
            status: e.key,
          };
          try {
            await mutation.mutateAsync(data).then((data) => {});
          } catch (error: any) {
            message.error(error.response.data.message).then(() => {});
          }
        },
      }}
    >
      <span
        className={`capitalize ${
          status == "verified"
            ? "text-[#8cbfad]"
            : status == "warned"
            ? "text-[#a3965f]"
            : "text-[#ff9398]"
        } `}
      >
        {status}
      </span>
    </Dropdown.Button>
  );
};

export default CustomerStatus;
