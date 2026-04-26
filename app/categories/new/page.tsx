"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, Space, message } from "antd";
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

  const mutation = useMutation({
    mutationFn: (data) => customFetch.post("/categories", data),
    onSuccess(data) {
      message
        .success(data.data.category.name + " " + t.categories.addedSuccess)
        .then(() => {
          push(`/categories`);
        });
    },
    onError(error: any) {
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
        <div className="flex gap-8">
          <div className="w-full md:w-6/12">
            <Form.Item
              name="name"
              label={t.categories.categoryName}
              rules={[{ required: true }]}
            >
              <Input />
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
