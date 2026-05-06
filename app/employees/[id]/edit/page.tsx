"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd";
import { Button, Form, Input, Select, Space, Spin, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Employee } from "@/types/global";

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

const Page = ({ params }: { params: { id: string } }) => {
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const { push } = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["employee", params.id],
    queryFn: (): Promise<{ employee: Employee }> =>
      customFetch.get(`employees/${params.id}`).then((r) => r.data),
  });

  React.useEffect(() => {
    if (data?.employee) {
      form.setFieldsValue({
        name: data.employee.name,
        phone: data.employee.phone,
        job: data.employee.job,
        nationalId: data.employee.nationalId ?? "",
        salary: data.employee.salary ?? 0,
      });
    }
  }, [data, form]);

  const validatePhoneNumber = (_: any, value: any) => {
    const phoneRegex = /^[0-9]{11}$/;
    if (value && !phoneRegex.test(value)) {
      return Promise.reject(t.common.phoneError);
    }
    return Promise.resolve();
  };

  const mutation = useMutation({
    mutationFn: (formData: any) =>
      customFetch.put(`employees/${params.id}?type=update_employee`, formData),
    onSuccess: () => {
      message.success(t.employees.editedSuccess).then(() => {
        push(`/employees/${params.id}`);
      });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message ?? "Error");
    },
  });

  const onFinish = async (formData: any) => {
    await mutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-6 md:p-0">
      <h2 className="text-xl font-bold text-tittle dark:text-on-surface">
        {t.employees.editEmployee}
      </h2>
      <Form
        form={form}
        onFinish={onFinish}
        name="editEmployee"
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label={t.employees.fullName}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <div className="flex gap-8">
          <div className="w-full md:w-6/12">
            <Form.Item
              name="phone"
              label={t.employees.phoneNumber}
              rules={[{ required: true }, { validator: validatePhoneNumber }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="w-full md:w-6/12">
            <Form.Item
              name="job"
              label={t.employees.position}
              rules={[
                { required: true, message: t.employees.selectPositionError },
              ]}
            >
              <Select placeholder={t.employees.selectPosition}>
                <Select.Option value="delivery">
                  {t.employees.deliveryMan}
                </Select.Option>
                <Select.Option value="manger">
                  {t.employees.manager}
                </Select.Option>
                <Select.Option value="call center">
                  {t.employees.callCenter}
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <Form.Item name="nationalId" label={t.employees.nationalId}>
          <Input
            placeholder={t.employees.nationalIdPlaceholder}
            maxLength={20}
          />
        </Form.Item>

        <Form.Item name="salary" label={t.employees.salary}>
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item>
          <Space>
            <SubmitButton form={form} />
            <Button onClick={() => push(`/employees/${params.id}`)}>
              {t.common.cancel}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
