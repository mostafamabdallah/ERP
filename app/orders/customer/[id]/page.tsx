"use client";
import { customFetch } from "@/utilities/fetch";
import { faBoxOpen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "@prisma/client";
import { AutoComplete, Input } from "antd";
import React, { useEffect, useReducer, useState } from "react";
import ProductsCards from "../../components/ProductsCards";

import { useCallback } from "react";
import SideNav from "@/components/layout/SideNav";
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
        (item: SelectedItem, index: number) =>
          index !== Number(action.payload.id - 1)
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
  const [activeDeleteID, setActiveDeleteID] = useState(0);

  const onSelect = (value: any, option: Item) => {
    setSearchName(option.name);
    setItem({
      ...item,
      id: option.id,
      name: option.name,
      category: option.category,
      unit: option.unit,
      price: option.price,
      quantity: 1,
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

  const deleteCallBack = (id: number) => {
    dispatch({ type: "REMOVEITEM", payload: { id: id, selectedItems } });
  };

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
                return (
                  <ProductsCards
                    data={el}
                    deleteProduct={deleteCallBack}
                  ></ProductsCards>
                );
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
                quantity: Number(1),
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
              <div className="sm:col-span-1">
                <label
                  htmlFor="itemname"
                  className="block text-sm font-medium leading-6 text-tittle"
                >
                  Quantity
                </label>
                <div className="mt-2">
                  <Input
                    value={item?.quantity}
                    defaultValue={1}
                    onChange={(e) => {
                      setItem({
                        ...item,
                        quantity: Number(e.target.value),
                      });
                    }}
                    placeholder="Quantity"
                  />
                </div>
              </div>
              <div className="sm:col-span-1 flex items-end ">
                <button type="submit" className="flex items-end">
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
