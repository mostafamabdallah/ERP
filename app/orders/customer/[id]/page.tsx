"use client";
import { customFetch } from "@/utilities/fetch";
import { Category, Item } from "@prisma/client";
import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import { useLanguage } from "@/contexts/LanguageContext";

const Page = ({ params }: { params: { id: string } }) => {
  const { Option } = Select;
  const { push } = useRouter();
  const { t } = useLanguage();
  const [itemSearch, setItemSearch] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();

  // Quick-create item modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  // Items created inline — always available in dropdown
  const [extraItems, setExtraItems] = useState<Item[]>([]);

  // Per-row: selected item and its editable price
  const [selectedItemsByRow, setSelectedItemsByRow] = useState<
    Record<number, Item>
  >({});
  const [pricesByRow, setPricesByRow] = useState<Record<number, number>>({});

  // ── Mutations ───────────────────────────────────────────────────────────────

  const orderMutation = useMutation({
    mutationFn: (data: any) =>
      customFetch.post(`/orders/customers/${params.id}`, data),
  });

  const createItemMutation = useMutation({
    mutationFn: (data: any) => customFetch.post("/items", data),
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) =>
      customFetch.patch(`/items/${id}`, { price }),
  });

  // ── Queries ─────────────────────────────────────────────────────────────────

  const { data: fetchedItems = [] } = useQuery({
    queryKey: ["items", itemSearch],
    queryFn: (): Promise<Item[]> =>
      customFetch
        .get(`items/?name=${itemSearch}`)
        .then((r) => r.data.items),
    enabled: Boolean(itemSearch),
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[]> =>
      customFetch.get("categories").then((r) => r.data.categories),
    initialData: [],
  });

  const deliveryMen = useQuery({
    queryKey: ["employees_delivery"],
    queryFn: (): Promise<any> =>
      customFetch
        .get(`employees?type=delivery`)
        .then((r) => r.data.employees),
    refetchOnWindowFocus: true,
    refetchInterval: 1000,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // Merge fetched + inline-created items, deduplicated by id
  const allItems: Item[] = [
    ...extraItems,
    ...fetchedItems.filter((fi) => !extraItems.some((ei) => ei.id === fi.id)),
  ];

  // Show "Name (price)" in the dropdown so users see the current price at a glance
  const itemOptions = allItems.map((el: any) => ({
    value: el.id.toString(),
    label: `${el.name}  (${el.price})`,
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleItemSelect = (rowIndex: number, itemId: string) => {
    const found = allItems.find((i) => i.id.toString() === itemId);
    if (!found) return;
    setSelectedItemsByRow((prev) => ({ ...prev, [rowIndex]: found }));
    setPricesByRow((prev) => ({ ...prev, [rowIndex]: found.price }));
  };

  const handlePriceBlur = (rowIndex: number) => {
    const item = selectedItemsByRow[rowIndex];
    const newPrice = pricesByRow[rowIndex];
    if (!item || newPrice === undefined || newPrice === item.price) return;

    updatePriceMutation.mutate(
      { id: item.id, price: newPrice },
      {
        onSuccess: () => {
          message.success(t.orders.priceUpdated);
          const updatedItem = { ...item, price: newPrice };
          setSelectedItemsByRow((prev) => ({ ...prev, [rowIndex]: updatedItem }));
          setExtraItems((prev) =>
            prev.map((i) => (i.id === item.id ? updatedItem : i))
          );
        },
        onError: () => {
          message.error("Failed to update price");
          setPricesByRow((prev) => ({ ...prev, [rowIndex]: item.price }));
        },
      }
    );
  };

  const onFinish = async (data: any) => {
    setDisabled(true);
    const order = { customerId: params.id, ...data };
    try {
      await orderMutation.mutateAsync(order).then((res) => {
        push(`/orders/${res.data.order.id}`);
      });
    } catch (error: any) {
      message.error(error.response.data.message).then(() => {
        push(`/categories`);
      });
    }
  };

  const openCreateItemModal = (fieldIndex: number) => {
    setActiveFieldIndex(fieldIndex);
    if (itemSearch) itemForm.setFieldValue("name", itemSearch);
    setIsModalOpen(true);
  };

  const handleCreateItem = async () => {
    try {
      const values = await itemForm.validateFields();
      const result = await createItemMutation.mutateAsync(values);
      const newItem: Item = result.data.item;

      setExtraItems((prev) => [newItem, ...prev]);
      message.success(t.items.addedSuccess);

      if (activeFieldIndex !== null) {
        const currentItems = form.getFieldValue("items") ?? [];
        currentItems[activeFieldIndex] = {
          ...currentItems[activeFieldIndex],
          id: newItem.id.toString(),
        };
        form.setFieldsValue({ items: currentItems });
        setSelectedItemsByRow((prev) => ({
          ...prev,
          [activeFieldIndex]: newItem,
        }));
        setPricesByRow((prev) => ({
          ...prev,
          [activeFieldIndex]: newItem.price,
        }));
      }

      setIsModalOpen(false);
      itemForm.resetFields();
      setActiveFieldIndex(null);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    itemForm.resetFields();
    setActiveFieldIndex(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex w-full justify-center">
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        className="w-full md:w-8/12"
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
                  {/* Item selector — label shows name + current price */}
                  <Form.Item
                    {...restField}
                    name={[name, "id"]}
                    rules={[
                      { required: true, message: t.orders.missingItem },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ minWidth: 220 }}
                      placeholder={t.orders.selectItem}
                      optionFilterProp="children"
                      onSearch={(value) => setItemSearch(value || null)}
                      filterOption={filterOption}
                      options={itemOptions}
                      onSelect={(value: string) =>
                        handleItemSelect(name, value)
                      }
                    />
                  </Form.Item>

                  {/* Quantity */}
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
                    <InputNumber
                      className="w-full"
                      placeholder={t.orders.quantity}
                    />
                  </Form.Item>

                  {/* Editable price — auto-filled on item select, saves to DB on blur */}
                  <Tooltip title={t.orders.itemPrice}>
                    <InputNumber
                      value={pricesByRow[name]}
                      placeholder={t.orders.itemPrice}
                      min={0}
                      max={10000}
                      disabled={!selectedItemsByRow[name]}
                      style={{ width: 90 }}
                      onChange={(val) =>
                        setPricesByRow((prev) => ({
                          ...prev,
                          [name]: val ?? 0,
                        }))
                      }
                      onBlur={() => handlePriceBlur(name)}
                    />
                  </Tooltip>

                  {/* Quick-create new item */}
                  <Tooltip title={t.orders.createNewItem}>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => openCreateItemModal(name)}
                    />
                  </Tooltip>

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
          <InputNumber
            className="w-6/12"
            placeholder={t.orders.deliveryCostPlaceholder}
          />
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

      {/* Quick-create item modal — outside <Form> to avoid nested <form> elements */}
      <Modal
        title={t.orders.createNewItem}
        open={isModalOpen}
        onOk={handleCreateItem}
        onCancel={handleModalCancel}
        confirmLoading={createItemMutation.isPending}
        okText={t.common.submit}
        cancelText={t.common.reset}
      >
        <Form form={itemForm} layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label={t.items.itemName}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
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
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
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
            <InputNumber className="w-full" />
          </Form.Item>
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
          <Form.Item
            name="category"
            label={t.items.category}
            rules={[{ required: true, message: t.items.selectCategoryError }]}
          >
            <Select placeholder={t.items.selectItemCategory}>
              {categories.data.map((el: any, i: number) => (
                <Select.Option key={i} value={el.id}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
