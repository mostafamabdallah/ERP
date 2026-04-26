"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, InputNumber, Select, Space, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import TextArea from "antd/es/input/TextArea";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const { push } = useRouter();

  const mutation = useMutation({
    mutationFn: (data) => customFetch.post("/expenses", data),
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
      message.error(error.response.data.message).then(() => {
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
              <Select placeholder={t.expenses.selectUnit}>
                <Select.Option value="اجور">{t.expenses.salaries}</Select.Option>
                <Select.Option value="بنزين">{t.expenses.gasoline}</Select.Option>
                <Select.Option value="دعاية">{t.expenses.advertising}</Select.Option>
                <Select.Option value="تصليح">{t.expenses.maintenance}</Select.Option>
                <Select.Option value=">رأس مال">{t.expenses.capital}</Select.Option>
                <Select.Option value="أخرى">{t.expenses.other}</Select.Option>
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
              <InputNumber />
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
