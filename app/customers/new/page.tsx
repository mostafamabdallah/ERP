"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, Select, Space, message } from "antd";
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
  const validatePhoneNumber = (_: any, value: any) => {
    // Define your phone number pattern using a regular expression
    const phoneRegex = /^[0-9]{11}$/;

    if (value && !phoneRegex.test(value)) {
      return Promise.reject("Please enter a valid phone number (11 digits).");
    }

    return Promise.resolve();
  };
  const [form] = Form.useForm();
  const { push } = useRouter();
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post("/customers", data);
    },
    onSuccess: (res) => {
      message.success("customer added successfully").then(() => {
        push(`/orders/customer/${res.data.customer.id}`);
      });
    },
  });

  const onFinish = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: any) {
      message.error(error.response.data.message).then(() => {
        push(`/customers`);
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
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Full Address"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <div className="flex gap-8">
          <div className="w-full md:w-6/12">
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true }, { validator: validatePhoneNumber }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="w-full md:w-6/12">
            <Form.Item
              name="type"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="select your gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Pharmacy">Pharmacy</Select.Option>
                <Select.Option value="Super Market">Super Market</Select.Option>
                <Select.Option value="Restaurant">Restaurant</Select.Option>
                <Select.Option value="Vegetables">
                  Vegetables Market
                </Select.Option>
                <Select.Option value="Private Business">
                  Private Business
                </Select.Option>
                <Select.Option value="Cleaning Service">
                  Cleaning Service
                </Select.Option>
                <Select.Option value="Butcher">Butcher</Select.Option>
                <Select.Option value="Others">Others</Select.Option>
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
