"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Customer } from "../../../types/global";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import { faEdit, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import CustomerStatus from "./CustomerStatus";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  customers: Customer[];
  // Server-side pagination & search (optional — omit for client-side mode)
  total?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (search: string) => void;
  loading?: boolean;
};

type DataIndex = keyof Customer;

const CustomerTable = ({
  customers,
  total,
  currentPage = 1,
  pageSize = 20,
  onPageChange,
  onSearch,
  loading,
}: Props) => {
  const { push } = useRouter();
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef<InputRef>(null);

  const isServerSide = Boolean(onPageChange);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm({ closeDropdown: false });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Customer> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm: confirmFilter, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`${t.common.search}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            if (onSearch) {
              onSearch((selectedKeys[0] as string) || "");
              confirmFilter();
            } else {
              handleSearch(selectedKeys as string[], confirmFilter, dataIndex);
            }
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="bg-primary text-white"
            onClick={() => {
              if (onSearch) {
                onSearch((selectedKeys[0] as string) || "");
                confirmFilter();
              } else {
                handleSearch(selectedKeys as string[], confirmFilter, dataIndex);
              }
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t.common.search}
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              onSearch?.("");
            }}
            size="small"
            style={{ width: 90 }}
          >
            {t.common.reset}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    ...(onSearch
      ? {}
      : {
          onFilter: (value, record) =>
            record[dataIndex]
              ?.toString()
              .toLowerCase()
              .includes((value as string).toLowerCase()),
        }),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100);
    },
  });

  const columns: ColumnsType<Customer> = [
    {
      title: t.common.id,
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: t.common.name,
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: t.common.address,
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: t.common.phone,
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: t.common.status,
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status, record) => (
        <CustomerStatus status={status} id={record.id} />
      ),
    },
    {
      title: t.customers.orders,
      dataIndex: "orders",
      key: "orders",
      render: (_, record) => (
        <div className="flex gap-3">
          <FontAwesomeIcon
            onClick={() => push(`/orders/customer/${record.id}`)}
            className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
            icon={faPlus}
          />
          <FontAwesomeIcon
            onClick={() => push(`/customers/${record.id}`)}
            className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
            icon={faEye}
          />
          <FontAwesomeIcon
            onClick={() => push(`/customers/${record.id}/update`)}
            className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
            icon={faEdit}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      rowKey="id"
      loading={loading}
      pagination={
        isServerSide
          ? {
              total,
              current: currentPage,
              pageSize,
              onChange: onPageChange,
              showTotal: (t) => `Total ${t} records`,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }
          : { pageSize: 20, showSizeChanger: true }
      }
    />
  );
};

export default CustomerTable;
