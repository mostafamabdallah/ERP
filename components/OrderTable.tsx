import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, MenuProps } from "antd";
import { Button, Dropdown, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import { faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Order } from "@/types/global";
import OrderStatus from "@/app/orders/components/OrderStatus";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/utilities/fetch";
type Props = {
  orders: Order[];
};

type DataIndex = keyof Order;

const { confirm } = Modal;



const OrderTable = ({ orders }: Props) => {
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();

  const deleteOrder = (data: any) => {
    return customFetch.put(`/orders/${data.id}`,data);
  };
  // @ts-ignore
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleOrderDeleting = (id: any) => {
    try {
      deleteOrderMutation.mutate({
        id: id,
      });
    } catch (error) {}
  };


  const showConfirm = (id: number) => {
    confirm({
      title: "Confirmation",
      content: "Do you want to delete this order?",
      okType: "danger",
      onOk() {
        handleOrderDeleting(id);
      },
    });
  };

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
    confirm({ closeDropdown: false });
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Order> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onKeyDown={() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex);
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="bg-primary text-white"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="middle"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
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
        return <OrderStatus status={status} id={record.id}></OrderStatus>;
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
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (id, record) => {
        return (
          <div className="flex gap-3">
            {" "}
            <FontAwesomeIcon
              onClick={() => {
                showConfirm(record.id);
              }}
              className="p-3 text-danger bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
              icon={faTrash}
            ></FontAwesomeIcon>
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default OrderTable;
