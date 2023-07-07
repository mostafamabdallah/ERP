"use client";
import { customFetch } from "@/utilities/fetch";
import { faBoxOpen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "@prisma/client";
import { AutoComplete, Input } from "antd";
import React, { useEffect, useReducer, useState } from "react";
import SelectedItemsCard from "./components/SelectedItemsCard";

type Props = {};
export type SelectedItem = {
  id?: number;
  name?: string;
  quantity?: number;
  category?: any;
  unit?: any;
  price?: any;
};

type ActionType =
  | { type: "ADDITEM"; payload: any }
  | { type: "REMOVEITEM"; payload: any };
const reducer = (state: SelectedItem[], action: ActionType) => {
  switch (action.type) {
    case "ADDITEM":
      return [...state, action.payload.item];
    case "REMOVEITEM":
      return action.payload.selectedItems.filter(
        (item: SelectedItem, index: number) => index !== action.payload.id
      );
    default:
      throw new Error();
  }
};

const Page = ({ params }: { params: { id: string } }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<SelectedItem>();
  const [searchName, setSearchName] = useState("");
  const [delivaryCost, setDelivaryCost] = useState("5");
  const [value, setValue] = useState("");

  const onSelect = (value: any, option: Item) => {
    setSearchName(option.name);
    setItem({
      ...item,
      id: option.id,
      name: option.name,
      category: option.category,
      unit: option.unit,
      price: option.price,
    });
  };

  const onChange = (data: string) => {
    setValue(data);
  };
  const initialState: SelectedItem[] = [];
  const [selectedItems, dispatch] = useReducer(reducer, initialState);

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
    getItemByName(searchName);
  }, [searchName]);
  useEffect(() => {
    getItemByName(searchName);
  }, [selectedItems]);

  let toatalPrice = 0;

  const createOrder = () => {
    customFetch
      .post("orders", {
        customerID: params.id,
        items: selectedItems,
        delivaryCost: delivaryCost,
      })
      .then((res) => {})
      .catch((err) => {
        alert("Customer already exict");
      });
  };

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
          <div className="flex flex-col">
            <ul className="flex flex-row p-2 w-full rounded-md gap-3 flex-wrap">
              {selectedItems.map((el: SelectedItem, i: number) => {
                toatalPrice += Number(el.price) * Number(el.quantity);
                return <SelectedItemsCard key={i} data={el}></SelectedItemsCard>;
              })}
            </ul>

            {selectedItems.length ? (
              <div className="flex flex-row w-full justify-end items-end gap-3">
                <div className="flex flex-col">
                  <label
                    htmlFor="itemname"
                    className="block text-sm font-medium leading-6 text-tittle"
                  >
                    Delivery cost
                  </label>{" "}
                  <input
                    onChange={(e) => {
                      setDelivaryCost(e.target.value);
                    }}
                    type="text"
                    defaultValue={5}
                    placeholder="delivery "
                    className="block w-[80px] p-2  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                  />
                </div>
                <button
                  onClick={() => {
                    createOrder();
                  }}
                  type="button"
                  className="rounded-md px-5 py-2 flex gap-1 text-sm items-center justify-between text-white bg-primary hover:bg-[#0f62fe95]"
                >
                  Finish order
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-row items-center gap-5 border-t border-border py-3 mt-5 justify-end">
            <span>Total price:</span>{" "}
            <span className="text-4xl text-danger font-bold bg-[#da1e2720] py-2 px-4 rounded-lg">
              {toatalPrice} EG
            </span>
          </div>

          <form
            onSubmit={(e) => {
              setSearchName("");
              //@ts-ignore
              dispatch({ type: "ADDITEM", payload: { item } });
              setItem({
                ...item,
                quantity: Number(0),
              });
              e.preventDefault();
            }}
          >
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 items-end">
              <div className="sm:col-span-2">
                <AutoComplete
                  popupClassName="certain-category-search-dropdown"
                  options={items.map((el, i) => {
                    return { value: el.name, ...el };
                  })}
                  onSelect={onSelect}
                  onSearch={(text) => setSearchName(text)}
                >
                  <Input.Search size="large" placeholder="input here" />
                </AutoComplete>
              </div>
              {/* <div className="sm:col-span-2">
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
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>

                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => {
                          setSearchName(e.target.value);
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
                              setSearchName(el.name);
                              setItem({
                                ...item,
                                id: el.id,
                                name: el.name,
                                category: el.category,
                                unit: el.unit,
                                price: el.price,
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
                  </div>
                </div>
              </div> */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="itemname"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  Quantity
                </label>
                <div className="mt-2">
                  <input
                    value={item?.quantity}
                    onChange={(e) => {
                      setItem({
                        ...item,
                        quantity: Number(e.target.value),
                      });
                    }}
                    step=".01"
                    type="number"
                    name="quantity"
                    id="quantity"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 px-2  text-tittle shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 "
                  />
                </div>
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button type="submit">
                  <FontAwesomeIcon
                    className="p-3 text-primary bg-gray-100 hover:bg-gray-200 cursor-pointer font-extrabold rounded-md "
                    icon={faPlus}
                  ></FontAwesomeIcon>{" "}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
