"use client";
import InfoCard from "@/components/layout/InfoCard";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import {
  faAddressCard,
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faMap,
  faMapLocation,
  faMapLocationDot,
  faMarker,
  faPhone,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Page = ({ params }: { params: { id: string } }) => {
  const { data } = useQuery({
    queryKey: ["customer_orders"],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`orders/customers/${params.id}`)
        .then((response) => response.data.customer);
    },
    initialData: [],
  });

  const dashboardData = [
    {
      title: "Total Orders",
      icon: faUsers,
      iconColor: "text-[#0f62fe]",
      iconBgColor: "bg-[#0f62fe20]",
      value: data?.orders?.length,
      delta: 15,
      currency: "users",
      period: "week",
    },
    {
      title: "Delivered Orders",
      icon: faCheckCircle,
      iconColor: "text-[#8cbfad]",
      iconBgColor: "bg-[#8cbfad20]",
      value: data?.orders?.filter((el: any) => {
        return el.status == "succeeded";
      }).length,
      delta: 5,
      currency: "users",
      period: "week",
    },
    {
      title: "Failed Orders",
      icon: faLock,
      iconColor: "text-[#ff9398]",
      iconBgColor: "bg-[#ff939820]",
      value: data?.orders?.filter((el: any) => {
        return el.status == "failed";
      }).length,
      delta: 1,
      currency: "users",
      period: "week",
    },
  ];

  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col w-full  md:w-3/12 items-start gap-2">
        <Badge.Ribbon
          color={
            data.status == "verified"
              ? "#27783f"
              : data.status == "warned"
              ? "yellow"
              : "#da1e27"
          }
          text={data.status}
        >
          <Avatar shape="square" size={150} icon={<UserOutlined />} />
        </Badge.Ribbon>
        <p className="text-2xl mt-5  font-bold text-primary">{data.name}</p>
        <p className="flex gap-3 items-center ">
          <FontAwesomeIcon
            className="text-primary "
            icon={faMapLocationDot}
          ></FontAwesomeIcon>{" "}
          {data.address}
        </p>
        <p className="flex gap-3 items-center ">
          <FontAwesomeIcon
            className="text-primary"
            icon={faPhone}
          ></FontAwesomeIcon>{" "}
          {data.phone}
        </p>
        <Badge text={data.status} />
      </div>
      <div className="flex flex-col w-full md:w-9/12 gap-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 w-full">
          {dashboardData.map((el, i) => {
            return <InfoCard key={i} data={el}></InfoCard>;
          })}
        </div>
        <div className="flex flex-row flex-wrap gap-6 ">
          {/* <div className="w-full ">{<OrderTable orders={data} />}</div> */}
          <div className="w-full lg:w-4/12 bg-white rounded-md  flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
