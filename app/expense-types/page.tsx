"use client";
import { customFetch } from "@/utilities/fetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Popconfirm, message } from "antd";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ExpenseType = {
  id: number;
  nameAr: string;
  nameEn: string;
  createdAt: string;
};

const Page = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: expenseTypes = [], isLoading } = useQuery<ExpenseType[]>({
    queryKey: ["expense-types"],
    queryFn: () =>
      customFetch.get("expense-types").then((res) => res.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: { nameAr: string; nameEn: string }) =>
      customFetch.post("expense-types", data),
    onSuccess: () => {
      message.success(t.expenseTypes.addedSuccess);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["expense-types"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || t.expenseTypes.addError);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customFetch.delete(`expense-types/${id}`),
    onSuccess: () => {
      message.success(t.expenseTypes.deletedSuccess);
      queryClient.invalidateQueries({ queryKey: ["expense-types"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || t.expenseTypes.deleteError);
    },
  });

  const onFinish = (values: { nameAr: string; nameEn: string }) => {
    addMutation.mutate(values);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Add new type form */}
      <div className="bg-white dark:bg-surface-mid rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-700 dark:text-on-surface mb-4">
          {t.expenseTypes.addNew}
        </h2>
        <Form form={form} onFinish={onFinish} layout="inline" className="gap-2">
          <Form.Item
            name="nameAr"
            rules={[{ required: true, message: t.expenseTypes.nameArRequired }]}
          >
            <Input
              placeholder={t.expenseTypes.nameArPlaceholder}
              className="w-48"
              dir="rtl"
            />
          </Form.Item>
          <Form.Item
            name="nameEn"
            rules={[{ required: true, message: t.expenseTypes.nameEnRequired }]}
          >
            <Input
              placeholder={t.expenseTypes.nameEnPlaceholder}
              className="w-48"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={addMutation.isPending}
              className="text-white bg-primary border-primary hover:!bg-[#0f62fe95] hover:!border-[#0f62fe95] flex items-center gap-1"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              {t.common.addNew}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Types table */}
      <div className="bg-white dark:bg-surface-mid rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-start text-gray-500">
          <thead className="text-xs text-gray-700 border-b border-border dark:border-outline-dark">
            <tr>
              <th className="px-4 py-3 font-bold text-base text-tittle dark:text-on-surface w-16">
                {t.common.id}
              </th>
              <th className="px-4 py-3 font-bold text-base text-tittle dark:text-on-surface">
                {t.expenseTypes.nameAr}
              </th>
              <th className="px-4 py-3 font-bold text-base text-tittle dark:text-on-surface">
                {t.expenseTypes.nameEn}
              </th>
              <th className="px-4 py-3 font-bold text-base text-tittle dark:text-on-surface w-24">
                {t.orders.delete}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  {t.expenseTypes.loading}
                </td>
              </tr>
            ) : expenseTypes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  {t.expenseTypes.empty}
                </td>
              </tr>
            ) : (
              expenseTypes.map((type) => (
                <tr
                  key={type.id}
                  className="border-b border-border dark:border-outline-dark transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#ffffff08]"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-on-surface">
                    {type.id}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-on-surface font-semibold" dir="rtl">
                    {type.nameAr}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-on-surface">
                    {type.nameEn}
                  </td>
                  <td className="px-4 py-3">
                    <Popconfirm
                      title={t.expenseTypes.confirmDeleteTitle}
                      description={t.expenseTypes.confirmDeleteContent}
                      onConfirm={() => deleteMutation.mutate(type.id)}
                      okText={t.orders.delete}
                      cancelText={t.common.reset}
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        danger
                        size="small"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        loading={deleteMutation.isPending}
                      />
                    </Popconfirm>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
