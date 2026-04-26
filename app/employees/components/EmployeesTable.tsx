"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Employee } from "../../../types/global";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  employees: Employee[];
};

type DataIndex = keyof Employee;

const EmployeesTable = ({ employees }: Props) => {
  const { t } = useLanguage();
  const { push } = useRouter();
  const [searchText, setSearchText] = useState("");

  const jobLabelMap: Record<string, string> = {
    delivery: t.employees.jobDelivery,
    manger: t.employees.jobManager,
    "call center": t.employees.jobCallCenter,
  };
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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Employee> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`${t.common.search} ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onKeyDown={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
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
            size="small"
            style={{ width: 90 }}
          >
            {t.common.search}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100);
    },
  });

  const columns: ColumnsType<Employee> = [
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
      title: t.common.phone,
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: t.employees.job,
      dataIndex: "job",
      key: "job",
      ...getColumnSearchProps("job"),
      render: (job: string) => jobLabelMap[job] ?? job,
    },
    {
      title: t.employees.viewProfile,
      key: "profile",
      render: (_: any, record: Employee) => (
        <FontAwesomeIcon
          onClick={() => push(`/employees/${record.id}`)}
          className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md"
          icon={faEye}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={employees}
      pagination={{ pageSize: 100 }}
    />
  );
};

export default EmployeesTable;
