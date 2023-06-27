"use client";
import { customFetch } from "@/utilities/fetch";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {};

const Page = (props: Props) => {
  const addNewItem = (data: any) => {
    customFetch
      .post("items", data)
      .then((res) => {})
      .catch((err) => {
        alert("item already exict");
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className="flex flex-col w-full gap-6">
      <form
        onSubmit={handleSubmit((data) => {
          addNewItem({
            name: data.name,
            price: Number(data.price),
            category: data.category,
            status: data.status,
            unit: data.unit,
          });
        })}
      >
        <div className="space-y-12">
          <div className="pb-12">
            <h2 className="text-base font-semibold leading-7 text-tittle">
              Item Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              please enter all Item details.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="itemname"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    name="name"
                    id="itemname"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 px-2  text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                  {errors.name && (
                    <p className="text-red-500">Item name is required.</p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  price
                </label>
                <div className="mt-2">
                  <input
                    {...register("price", { required: true })}
                    id="price"
                    name="price"
                    type="number"
                    autoComplete="price"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                  {errors.category && (
                    <p className="text-red-500">Item price is required.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="itemcategory"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    {...register("category", { required: true })}
                    id="category"
                    name="category"
                    className="block w-full rounded-md border-0 py-2.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="" selected hidden disabled>
                      category
                    </option>
                    <option value="خضروات">خضروات</option>
                    <option value="فاكة">فاكة</option>
                    <option value="منظفات">منظفات</option>
                    <option value="عطارة">عطارة</option>
                    <option value="بقالة">بقالة</option>
                    <option value="مستلزمات صحية">مستلزمات صحية</option>
                    <option value="مستلزمات صحية"> مجمدات</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500">Item category is required.</p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  Status
                </label>
                <div className="mt-2">
                  <select
                    {...register("status", { required: true })}
                    id="status"
                    name="status"
                    className="block w-full rounded-md border-0 py-2.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="" selected hidden disabled>
                      status
                    </option>
                    <option value="اساسي">اساسي</option>
                    <option value="تعاقد">تعاقد</option>
                    <option value="مستبعد">مستبعد</option>
                    <option value="مطلوب">مطلوب</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500">Item status is required.</p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  unit
                </label>
                <div className="mt-2">
                  <select
                    {...register("unit", { required: true })}
                    id="unit"
                    name="unit"
                    className="block w-full rounded-md border-0 py-2.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  >
                    <option value="" selected hidden disabled>
                      unit
                    </option>
                    <option value="كيلو">كيلو</option>
                    <option value="علبة">علبة</option>
                    <option value="كرتونة">كرتونة</option>
                    <option value="زجاجة">زجاجة</option>
                    <option value="كيس">كيس</option>
                    <option value="وحدة">وحدة</option>
                  </select>
                  {errors.unit && (
                    <p className="text-red-500">Item status is required.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6 w-full">
          <button
            type="submit"
            className="text-sm font-semibold leading-6 text-tittle"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
