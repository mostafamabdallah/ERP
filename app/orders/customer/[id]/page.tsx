"use client";
import { customFetch } from "@/utilities/fetch";
import { Item } from "@prisma/client";
import React, { useEffect, useReducer, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Space, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";

const Page = ({ params }: { params: { id: string } }) => {
  const { push } = useRouter();

  const [item, setItem] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (data) => {
      return customFetch.post(`/orders/customers/${params.id}`, data);
    },
  });

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFinish = async (data: any) => {
    setDisabled(true);
    const order = {
      customerId: params.id,
      ...data,
    };
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
  const { data, isSuccess } = useQuery({
    queryKey: ["items", item],
    queryFn: (): Promise<Item[]> => {
      return customFetch
        .get(`items/?name=${item}`)
        .then((response) => response.data.items);
    },
    initialData: [],
    enabled: Boolean(item),
  });

  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex w-full justify-center">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        className="w-6/12"
      >
        <Form.List name="items">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <>
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="start"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "id"]}
                          rules={[{ required: true, message: "Missing Item" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select an item"
                            optionFilterProp="children"
                            onSearch={(value) => {
                              setItem(value);
                            }}
                            filterOption={filterOption}
                            options={data.map((el, i) => {
                              return {
                                value: el.id.toString(),
                                label: el.name,
                              };
                            })}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          rules={[
                            {
                              type: "number",
                              required: true,
                              message: "Please enter a valid number",
                              min: 0,
                              max: 1000,
                            },
                          ]}
                        >
                          <InputNumber
                            className="w-full"
                            placeholder="Quantity "
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    </>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add item
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item
          className="w-full"
          name="deliveryCost"
          rules={[
            {
              type: "number",
              required: true,
              message: "Please enter a valid number",
              min: 5,
              max: 1000,
            },
          ]}
        >
          <InputNumber className="w-6/12" placeholder="Delivery Cost" />
        </Form.Item>
        <Form.Item name="orderDetails">
          <TextArea className="w-full" placeholder="Order Details "></TextArea>
        </Form.Item>
        <Form.Item>
          <Button disabled={disabled} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
