"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, InputNumber, Select, Space, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import TextArea from "antd/es/input/TextArea";
import { useLanguage } from "@/contexts/LanguageContext";

type ExpenseType = {
  id: number;
  nameAr: string;
  nameEn: string;
};

const SubmitButton = ({ form }: { form: FormInstance }) => {
  const [submittable, setSubmittable] = React.useState(false);
  const { t } = useLanguage();
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setSubmittable(true),
      () => setSubmittable(false)
    );
  }, [values, form]);

  return (
    <Button
      className="text-white bg-primary"
      htmlType="submit"
      disabled={!submittable}
    >
      {t.common.submit}
    </Button>
  );
};

const Page = () => {
  const { t, language } = useLanguage();
  const [form] = Form.useForm();
  const { push } = useRouter();

  const { data: expenseTypes = [], isLoading: typesLoading } = useQuery<ExpenseType[]>({
    queryKey: ["expense-types"],
    queryFn: () => customFetch.get("expense-types").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => customFetch.post("/expenses", data),
    onSuccess: () => {
      message.success(t.expenses.addedSuccess).then(() => {
        push(`/expenses`);
      });
    },
  });

  const onFinish = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: any) {
      message.error(error.response?.data?.message).then(() => {
        push(`/expenses`);
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 p-6 md:p-0">
      <Form
        form={form}
        onFinish={onFinish}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
      >
        <div className="flex gap-8">
          <div className="w-full md:w-4/12">
            <Form.Item
              name="type"
              label={t.expenses.expenseType}
              rules={[{ required: true, message: t.expenses.selectUnitError }]}
            >
              <Select
                placeholder={t.expenses.selectUnit}
                loading={typesLoading}
                showSearch
                optionFilterProp="label"
              >
                {expenseTypes.map((type) => (
                  <Select.Option
                    key={type.id}
                    value={type.nameAr}
                    label={language === "ar" ? type.nameAr : type.nameEn}
                  >
                    <span dir="rtl">{type.nameAr}</span>
                    {type.nameEn !== type.nameAr && (
                      <span className="text-gray-400 ms-2 text-xs">
                        ({type.nameEn})
                      </span>
                    )}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="w-full md:w-2/12">
            <Form.Item
              className="w-full"
              name="amount"
              label={t.expenses.expenseAmount}
              rules={[
                {
                  type: "number",
                  required: true,
                  message: t.common.validNumber,
                  min: 0,
                  max: 100000,
                },
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
          </div>
          <div className="w-fit flex-1 gap-8">
            <Form.Item
              className="w-full"
              name="description"
              label={t.expenses.expenseDescription}
              rules={[{ required: true }]}
            >
              <TextArea rows={1} />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Space>
            <SubmitButton form={form} />
            <Button htmlType="reset">{t.common.reset}</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
