"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, InputNumber, Select, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@prisma/client";

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
  }, [values]);

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
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[]> => {
      return customFetch
        .get("categories")
        .then((response) => response.data.categories);
    },
    initialData: [],
  });
  const [form] = Form.useForm();
  const { push } = useRouter();
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post("/items", data);
    },
  });

  const onFinish = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: any) {
      alert(error.response.data.message);
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
          <div className="w-full md:w-6/12">
            <Form.Item
              name="name"
              label="Item Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="w-full md:w-6/12 flex gap-8">
            <Form.Item
              className="w-fit"
              name="price"
              label="Item Price"
              rules={[
                {
                  type: "number",
                  required: true,
                  message: "Please enter a valid number",
                  min: 0,
                  max: 10000,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              className="w-fit"
              name="quantity"
              label="Item Quantity"
              rules={[
                {
                  type: "number",
                  required: true,
                  message: "Please enter a valid number",
                  min: 1,
                  max: 10000,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-full md:w-6/12">
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select item category">
                {categories.data.map((el, i) => {
                  return (
                    <Select.Option key={i} value={el.id}>
                      {el.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          <div className="w-full md:w-6/12">
            <Form.Item
              name="unit"
              label="Item Unit"
              rules={[{ required: true, message: "Please select unit!" }]}
            >
              <Select placeholder="Select item unit">
                <Select.Option value="كيلو">كيلو</Select.Option>
                <Select.Option value="علبة">علبة</Select.Option>
                <Select.Option value="كرتونة">كرتونة</Select.Option>
                <Select.Option value="زجاجة">زجاجة</Select.Option>
                <Select.Option value="كيس">كيس</Select.Option>
                <Select.Option value="وحدة">وحدة</Select.Option>
              </Select>
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
