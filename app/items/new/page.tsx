"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
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
    mutationFn: (data) => customFetch.post("/items", data),
    onSuccess: () => {
      message.success(t.items.addedSuccess).then(() => {
        push(`/items`);
      });
    },
  });

  const onFinish = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error: any) {
      message.error(error.response.data.message).then(() => {
        push(`/items`);
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
              label={t.items.itemName}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="w-full md:w-6/12 flex gap-8">
            <Form.Item
              className="w-fit"
              name="price"
              label={t.items.itemPrice}
              rules={[
                {
                  type: "number",
                  required: true,
                  message: t.common.validNumber,
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
              label={t.items.itemQuantity}
              rules={[
                {
                  type: "number",
                  required: true,
                  message: t.common.validNumber,
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
              label={t.items.category}
              rules={[{ required: true, message: t.items.selectCategoryError }]}
            >
              <Select placeholder={t.items.selectItemCategory}>
                {categories.data.map((el, i) => (
                  <Select.Option key={i} value={el.id}>
                    {el.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="w-full md:w-6/12">
            <Form.Item
              name="unit"
              label={t.items.itemUnit}
              rules={[{ required: true, message: t.items.selectUnitError }]}
            >
              <Select placeholder={t.items.selectItemUnit}>
                <Select.Option value="كيلو">{t.items.kilo}</Select.Option>
                <Select.Option value="علبة">{t.items.box}</Select.Option>
                <Select.Option value="كرتونة">{t.items.carton}</Select.Option>
                <Select.Option value="زجاجة">{t.items.bottle}</Select.Option>
                <Select.Option value="كيس">{t.items.bag}</Select.Option>
                <Select.Option value="وحدة">{t.items.unitOption}</Select.Option>
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
