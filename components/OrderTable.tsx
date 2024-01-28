import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef } from "react";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Order } from "@/types/global";

type Props = {
  orders: Order[];
};

type DataIndex = keyof Order;

const OrderTable = ({ orders }: Props) => {
  const data = orders.map((el, i) => {
    return {
      id: el.id,
      customerName: el.customer.name,
      customerPhone: el.customer.phone,
      address: el.customer.address,
      status: el.status,
      deliveryCost: el.deliveryCost,
    };
  });

  const { push } = useRouter();

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Order> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Phone	",
      dataIndex: "customerPhone",
      key: "customerPhone",
      ...getColumnSearchProps("customerPhone"),
    },
    {
      title: "Delivery cost",
      dataIndex: "deliveryCost",
      key: "deliveryCost",
      ...getColumnSearchProps("deliveryCost"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status, record) => {
        return (
          <div
            className={` ${
              status == "success"
                ? "bg-[#8cbfad20]"
                : status == "pending"
                ? "bg-[#a3965f20]"
                : "bg-[#ff939820]"
            } flex justify-center items-center  w-full px-3 py-1 rounded-sm font-bold`}
          >
            <span
              className={`${
                status == "success"
                  ? "text-[#8cbfad]"
                  : status == "pending"
                  ? "text-[#a3965f]"
                  : "text-[#ff9398]"
              } `}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (id, record) => {
        return (
          <div className="flex gap-3">
            {" "}
            <FontAwesomeIcon
              onClick={() => {
                push(`/orders/${record.id}`);
              }}
              className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
              icon={faEye}
            ></FontAwesomeIcon>
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default OrderTable;
