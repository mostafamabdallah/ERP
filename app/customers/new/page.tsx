"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, Select, Space, message } from "antd";
import { useMutation } from "@tanstack/react-query";
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

  const validatePhoneNumber = (_: any, value: any) => {
    const phoneRegex = /^[0-9]{11}$/;
    if (value && !phoneRegex.test(value)) {
      return Promise.reject(t.common.phoneError);
    }
    return Promise.resolve();
  };

  const mutation = useMutation({
    mutationFn: (data) => customFetch.post("/customers", data),
    onSuccess: (res) => {
      message.success(t.customers.addedSuccess).then(() => {
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
        <Form.Item name="name" label={t.customers.fullName} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label={t.customers.fullAddress} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <div className="flex gap-8">
          <div className="w-full md:w-6/12">
            <Form.Item
              name="phone"
              label={t.customers.phoneNumber}
              rules={[{ required: true }, { validator: validatePhoneNumber }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="w-full md:w-6/12">
            <Form.Item
              name="type"
              label={t.customers.gender}
              rules={[{ required: true, message: t.customers.selectGenderError }]}
            >
              <Select placeholder={t.customers.selectGender}>
                <Select.Option value="Male">{t.customers.male}</Select.Option>
                <Select.Option value="Female">{t.customers.female}</Select.Option>
                <Select.Option value="Pharmacy">{t.customers.pharmacy}</Select.Option>
                <Select.Option value="Super Market">{t.customers.superMarket}</Select.Option>
                <Select.Option value="Restaurant">{t.customers.restaurant}</Select.Option>
                <Select.Option value="Vegetables">{t.customers.vegetables}</Select.Option>
                <Select.Option value="Private Business">{t.customers.privateBusiness}</Select.Option>
                <Select.Option value="Cleaning Service">{t.customers.cleaningService}</Select.Option>
                <Select.Option value="Butcher">{t.customers.butcher}</Select.Option>
                <Select.Option value="Others">{t.customers.others}</Select.Option>
              </Select>
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
