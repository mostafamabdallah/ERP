"use client";
import { customFetch } from "@/utilities/fetch";
import { Item } from "@prisma/client";
import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Space, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import { useLanguage } from "@/contexts/LanguageContext";

const Page = ({ params }: { params: { id: string } }) => {
  const { Option } = Select;
  const { push } = useRouter();
  const { t } = useLanguage();
  const [item, setItem] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => customFetch.post(`/orders/customers/${params.id}`, data),
  });

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFinish = async (data: any) => {
    setDisabled(true);
    const order = { customerId: params.id, ...data };
    try {
      await mutation.mutateAsync(order).then((data) => {
        push(`/orders/${data.data.order.id}`);
      });
    } catch (error: any) {
      message.error(error.response.data.message).then(() => {
        push(`/categories`);
      });
    }
  };

  const { data } = useQuery({
    queryKey: ["items", item],
    queryFn: (): Promise<Item[]> => {
      return customFetch
        .get(`items/?name=${item}`)
        .then((response) => response.data.items);
    },
    initialData: [],
    enabled: Boolean(item),
  });

  const deliveryMen = useQuery({
    queryKey: [`employees_delivery`],
    queryFn: (): Promise<any> => {
      return customFetch
        .get(`employees?type=delivery`)
        .then((response) => response.data.employees);
    },
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
  });

  return (
    <div className="flex w-full justify-center">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        className="w-6/12"
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="start"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "id"]}
                    rules={[{ required: true, message: t.orders.missingItem }]}
                  >
                    <Select
                      showSearch
                      placeholder={t.orders.selectItem}
                      optionFilterProp="children"
                      onSearch={(value) => setItem(value)}
                      filterOption={filterOption}
                      options={data.map((el: any) => ({
                        value: el.id.toString(),
                        label: el.name,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[
                      {
                        type: "number",
                        required: true,
                        message: t.common.validNumber,
                        min: 0,
                        max: 1000,
                      },
                    ]}
                  >
                    <InputNumber className="w-full" placeholder={t.orders.quantity} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  {t.orders.addItem}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          className="w-full"
          name="deliveryCost"
          rules={[
            {
              type: "number",
              required: true,
              message: t.common.validNumber,
              min: 5,
              max: 1000,
            },
          ]}
        >
          <InputNumber className="w-6/12" placeholder={t.orders.deliveryCostPlaceholder} />
        </Form.Item>

        <Form.Item name="orderDetails">
          <TextArea className="w-full" placeholder={t.orders.orderDetails} />
        </Form.Item>

        <Form.Item rules={[{ required: true }]} name="deliveryMan">
          <Select placeholder={t.orders.deliveryManPlaceholder}>
            {deliveryMen.data?.map((el: any, i: number) => (
              <Option key={i} value={el.id}>
                {el.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button disabled={disabled} htmlType="submit">
            {t.common.submit}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
