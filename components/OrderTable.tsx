"use client";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Order } from "@/types/global";
import OrderStatus from "@/app/orders/components/OrderStatus";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
import moment from "moment";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  orders: Order[];
  // Server-side pagination & search (optional — omit for client-side mode)
  total?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (search: string) => void;
  loading?: boolean;
};

type DataIndex = keyof Order;

const { confirm } = Modal;

const OrderTable = ({
  orders,
  total,
  currentPage = 1,
  pageSize = 20,
  onPageChange,
  onSearch,
  loading,
}: Props) => {
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();
  const searchInput = useRef<InputRef>(null);

  const isServerSide = Boolean(onPageChange);

  const deleteOrder = (data: any) => {
    return customFetch.put(`/orders/${data.id}`, data);
  };
  // @ts-ignore
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
    },
  });

  const handleOrderDeleting = (id: any) => {
    try {
      deleteOrderMutation.mutate({ id });
    } catch (error) {}
  };

  const showConfirm = (id: number) => {
    confirm({
      title: t.orders.confirmTitle,
      content: t.orders.confirmContent,
      okType: "danger",
      onOk() {
        handleOrderDeleting(id);
      },
    });
  };

  const tableData = orders.map((el) => ({
    id: el.id,
    customerName: el.customer.name,
    customerPhone: el.customer.phone,
    address: el.customer.address,
    status: el.status,
    deliveryCost: el.deliveryCost,
    createdAt: moment(el.createdAt).format("YYYY-MM-DD h:mm A"),
    deliveryMan: el.employee?.name,
  }));

  const { push } = useRouter();

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<any> => ({
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
            size="middle"
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
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: t.common.id,
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: t.orders.customerName,
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: t.common.phone,
      dataIndex: "customerPhone",
      key: "customerPhone",
      ...getColumnSearchProps("customerPhone"),
    },
    {
      title: t.orders.deliveryCost,
      dataIndex: "deliveryCost",
      key: "deliveryCost",
      ...getColumnSearchProps("deliveryCost"),
    },
    {
      title: t.common.address,
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: t.common.date,
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
    },
    {
      title: t.orders.deliveryMan,
      dataIndex: "deliveryMan",
      key: "deliveryMan",
      ...getColumnSearchProps("deliveryMan"),
    },
    {
      title: t.common.status,
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status, record) => (
        <OrderStatus status={status} id={record.id} />
      ),
    },
    {
      title: t.orders.view,
      dataIndex: "view",
      key: "view",
      render: (_, record) => (
        <div className="flex gap-3">
          <FontAwesomeIcon
            onClick={() => push(`/orders/${record.id}`)}
            className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
            icon={faEye}
          />
        </div>
      ),
    },
    {
      title: t.orders.delete,
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <div className="flex gap-3">
          <FontAwesomeIcon
            onClick={() => showConfirm(record.id)}
            className="p-3 text-danger bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
            icon={faTrash}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      loading={loading}
      rowKey="id"
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

export default OrderTable;
