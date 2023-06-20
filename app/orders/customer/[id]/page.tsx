"use client";
import { customFetch } from "@/utilities/fetch";
import { faBoxOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};
type SelectedItem = {
  id: number;
  name: string;
  price: number | null;
  category: string | null;
  status: string | null;
  unit: string | null;
};
type AllSelectedItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: string;
  unit: string | null;
  quantity: number;
};
const Page = (props: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [active, setActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>();
  const [allSelectedItems, setAllSelectedItems] = useState<AllSelectedItem[]>(
    []
  );
  const getItemByName = (itemName: string) => {
    if (itemName != "") {
      customFetch
        .get(`items/?name=${itemName}`)
        .then((res) => {
          setItems(res.data.items);
        })
        .catch((err) => {});
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    getItemByName(itemName);
  }, [itemName]);

  const addNewOrder = (data: any) => {
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
    control,
    setValue,
    formState: { errors },
  } = useForm();
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="space-y-12">
        <div className="pb-12">
          <h2 className="text-base font-semibold leading-7 text-tittle">
            Order Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            please enter all Order details.
          </p>
          <div className="flex flex-row">
            <ul className="flex flex-row p-2  rounded-md gap-3">
              {allSelectedItems.map((el, i) => {
                return (
                  <li key={i} className="  bg-gray-200 px-4 py-3 rounded-lg ">
                    <div className="flex items-center gap-5">
                      <div className="flex-shrink-0 text-primary   bg-white flex items-center justify-center p-3 rounded-full">
                        <FontAwesomeIcon
                          className="text-2xl"
                          icon={faBoxOpen}
                        ></FontAwesomeIcon>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className=" font-medium text-gray-900 truncate text-2xl">
                          {el.name}
                        </p>
                        <p className=" text-gray-500 truncate dark:text-gray-400 text-2xl">
                          {el.category}
                        </p>
                      </div>
                      <div className="inline-flex items-centerfont-semibold text-gray-900 dark:text-white text-2xl">
                        {el.quantity}{" "}
                        <span className="text-green-600">{el.unit}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <ul></ul>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 items-end">
            <div className="sm:col-span-2">
              <label
                htmlFor="itemname"
                className="block text-sm font-medium leading-6 text-tittle"
              >
                Item
              </label>
              <div className="mt-2 w-full">
                <div
                  id="dropdownSearch"
                  className={` z-10  bg-white rounded-lg shadow  dark:bg-gray-700 w-full`}
                >
                  <label htmlFor="input-group-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>

                    <input
                      type="text"
                      name="itemName"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                      }}
                      className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                      placeholder="Search item"
                    />
                  </div>
                  <ul
                    className="max-h-48  overflow-y-auto text-sm text-gray-700 dark:text-gray-200 "
                    aria-labelledby="dropdownSearchButton"
                  >
                    {items.map((el, i) => {
                      return (
                        <li
                          className="hover:bg-gray-100 dark:hover:bg-gray-600 px-3 cursor-pointer"
                          key={i}
                          onClick={() => {
                            setItemName(el.name);
                            setSelectedItem({
                              id: el.id,
                              category: el.category,
                              name: el.name,
                              price: el.price,
                              status: el.status,
                              unit: el.unit,
                            });
                          }}
                        >
                          <div className="flex items-center  cursor-pointer">
                            <label className="w-8/12 py-2 ml-2 text-sm font-medium text-gray-900 rounded cursor-pointer">
                              {el.name}
                            </label>
                            <label
                              htmlFor=""
                              className="w-4/12 text-end py-2 ml-2 text-sm font-medium text-gray-900 rounded cursor-pointer"
                            >
                              {"(" + el.price + ")"} EG
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {errors.itemName && (
                    <p className="text-red-500">Item name is required.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="itemname"
                className="block text-sm font-medium leading-6 text-tittle"
              >
                Quantity
              </label>
              <div className="mt-2">
                <input
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                  }}
                  type="number"
                  name="quantity"
                  id="quantity"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 px-2  text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 "
                />
                {errors.quantity && (
                  <p className="text-red-500">Quantity is required.</p>
                )}
              </div>
            </div>
            <div className="sm:col-span-1 flex items-end">
              <FontAwesomeIcon
                onClick={() => {
                  const item = {
                    ...selectedItem,
                    quantity: quantity,
                  } as AllSelectedItem;
                  setAllSelectedItems([item, ...allSelectedItems]);
                }}
                className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
                icon={faPlus}
              ></FontAwesomeIcon>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
