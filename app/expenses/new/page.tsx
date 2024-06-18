"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import TextArea from "antd/es/input/TextArea";

type Props = {};
const SubmitButton = ({ form }: { form: FormInstance }) => {
  const [submittable, setSubmittable] = React.useState(false);
  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values, form]);

  return (
    <Button
      className="text-white bg-primary"
      htmlType="submit"
      disabled={!submittable}
    >
      Submit
    </Button>
  );
};

const Page = (props: Props) => {
  const [form] = Form.useForm();
  const { push } = useRouter();
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post("/expenses", data);
    },
    onSuccess: (res) => {
      message.success("expenses added successfully").then(() => {
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
        {" "}
        <div className="flex gap-8">
          <div className="w-full md:w-4/12">
            <Form.Item
              name="type"
              label="Expense Type"
              rules={[{ required: true, message: "Please select unit!" }]}
            >
              <Select placeholder="Select item unit">
                <Select.Option value="اجور">مرتبات و اجور</Select.Option>
                <Select.Option value="بنزين">بنزين</Select.Option>
                <Select.Option value="دعاية">دعاية و إعلان</Select.Option>
                <Select.Option value="تصليح">تصليح</Select.Option>
                <Select.Option value=">رأس مال">رأس مال</Select.Option>
                <Select.Option value="أخرى">أخرى</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="w-full md:w-2/12">
            <Form.Item
              className="w-full"
              name="amount"
              label="Expense Amount"
              rules={[
                {
                  type: "number",
                  required: true,
                  message: "Please enter a valid number",
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
              label="Expense Description"
              rules={[{ required: true }]}
            >
              <TextArea rows={1} />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Space>
            <SubmitButton form={form} />
            <Button htmlType="reset">Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
