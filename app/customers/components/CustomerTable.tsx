import { SearchOutlined } from "@ant-design/icons";
import { Customer } from "../../../types/global";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef } from "react";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

type Props = {
  customers: Customer[];
};

type DataIndex = keyof Customer;

const CustomerTable = ({ customers }: Props) => {
  const { push } = useRouter();

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Customer> => ({
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

  const columns: ColumnsType<Customer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Phone	",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
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
              status == "verified"
                ? "bg-[#8cbfad20]"
                : status == "warned"
                ? "bg-[#a3965f20]"
                : "bg-[#ff939820]"
            } flex justify-center items-center  w-full px-3 py-1 rounded-sm font-bold`}
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
              {status}
            </span>
          </div>
        );
      },
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      render: (id, record) => {
        return (
          <div className="flex gap-3">
            {" "}
            <FontAwesomeIcon
              onClick={() => {
                push(`/orders/customer/${record.id}`);
              }}
              className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
              icon={faPlus}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              onClick={() => {
                push(`/customers/${record.id}`);
              }}
              className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
              icon={faEye}
            ></FontAwesomeIcon>
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={customers} />;
};

export default CustomerTable;
