"use client";
import { customFetch } from "@/utilities/fetch";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {};

const Page = (props: Props) => {
  const [orders, setOrders] = useState([]);
  const addNewCustomer = (data: any) => {
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
      <div className="flex flex-row flex-wrap gap-5">
        <div className="flex flex-col w-full bg-white px-6 py-4">
          <form
            onSubmit={handleSubmit((data) => {
              addNewCustomer({
                name: data.name,
                price: data.price == "" ? null : Number(data.price),
              });
            })}
          >
            <div className="space-y-12">
              <div className="border-b border-border/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-tittle">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  please enter all customer details.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-full">
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("customerName", { required: true })}
                        type="text"
                        name="customerName"
                        id="customerName"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 px-2  text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {errors.customerName && (
                        <p className="text-red-500">
                          Customer name is required.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("customerPhone", { required: true })}
                        id="customerPhone"
                        name="customerPhone"
                        type="text"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500">
                          Phone number is required.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="customerKind"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Kind
                    </label>
                    <div className="mt-2">
                      <select
                        {...register("customerKind", { required: true })}
                        id="customerKind"
                        name="customerKind"
                        autoComplete="customerKind"
                        className="block w-full rounded-md border-0 py-2.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm "
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                      {errors.customerKind && (
                        <p className="text-red-500">
                          Customer kind is required.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="customerAdress"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Full Address
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("customerAdress", { required: true })}
                        type="text"
                        name="customerAdress"
                        id="customerAdress"
                        autoComplete="customerAdress"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {errors.customerAdress && (
                        <p className="text-red-500">
                          Customer adress kind is required.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full bg-white pt-5">
              <div className="border-b border-border/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-tittle">
                  Orders
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please enter the customer orders{" "}
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 items-end">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Item
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("customerPhone", { required: true })}
                        id="customerPhone"
                        name="customerPhone"
                        type="text"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500">
                          Phone number is required.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="customerKind"
                      className="block text-sm font-medium leading-6 text-tittle"
                    >
                      Quantity
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("customerAdress", { required: true })}
                        type="text"
                        name="customerAdress"
                        id="customerAdress"
                        autoComplete="customerAdress"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                      {errors.customerAdress && (
                        <p className="text-red-500">
                          Customer adress kind is required.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => {
                        
                      }}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Add
                    </button>
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
      </div>
    </div>
  );
};

export default Page;
