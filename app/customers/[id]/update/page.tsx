"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, Select, Space, Spin, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {};
const SubmitButton = ({ form }: any) => {
  const [submittable, setSubmittable] = React.useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
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

const Page = ({ params }: { params: { id: string } }) => {
  const validatePhoneNumber = (_: any, value: any) => {
    // Define your phone number pattern using a regular expression
    const phoneRegex = /^[0-9]{11}$/;

    if (value && !phoneRegex.test(value)) {
      return Promise.reject("Please enter a valid phone number (11 digits).");
    }

    return Promise.resolve();
  };

  const { data, isLoading } = useQuery({
    queryKey: [`customer_data_${params.id}`],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`orders/customers/${params.id}`)
        .then((response) => response.data.customer);
    },
  });

  const [form] = Form.useForm();
  const { push } = useRouter();
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.put(`/customers/${params.id}`, data);
    },
    onSuccess: (res) => {
      message.success("customer updated successfully").then(() => {
        push(`/customers/${res.data.customer.id}`);
      });
    },
  });

  const onFinish = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        address: data.address,
        phone: data.phone,
        type: data.type,
      });
    }
  }, [data, form]);

  console.log(isLoading);
  

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-6 p-6 md:p-0">
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-full gap-6 p-6 md:p-0">
        <Form
          form={form}
          onFinish={onFinish}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={{
            name: data?.name,
            address: data?.address,
            phone: data?.phone,
            type: data?.type,
          }}
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
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Space>
              <SubmitButton form={form} data={data} />
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }
};

export default Page;
