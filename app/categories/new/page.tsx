"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      return customFetch.post("/categories", data);
    },
    onSuccess(data, variables, context) {
      message
        .success(data.data.category.name + "Has been added successfully")
        .then(() => {
          push(`/categories`);
        });
    },
    onError(error: any, variables, context) {
      message.error(error.response.data.message).then(() => {
        push(`/categories`);
      });
    },
  });

  const onFinish = async (data: any) => {
    try {
      const categoryMutation = await mutation;
      categoryMutation.mutateAsync(data);
    } catch (error: any) {
      message.error(error.response.data.message).then(() => {
        push(`/categories`);
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
          <div className="w-full md:w-6/12">
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true }]}
            >
              <Input />
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
