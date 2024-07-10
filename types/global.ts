import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { type } from "os";

export type CardData = {
  title: string;
  icon: IconDefinition;
  iconColor: string;
  iconBgColor: string;
  value: number;
  delta?: any;
  currency?: string;
  period?: string;
};

export type Customer = {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
  orders: Order[];
  createdAt: string;
};

export type Employee = {
  id: number;
  name: string;
  phone: string;
  job: string;
  latitude: number;
  longitude: number;
  orders: Order[];
};

export type Order = {
  id: number;
  items: Item[];
  authorId: number;
  status: string;
  customerName: string;
  address: string;
  customerPhone: string;
  customer: Customer;
  deliveryCost: string;
  createdAt: string;
  employee: Employee;
  deliveryMan: string;
};

export type Item = {
  id: number;
  name: string;
  price: number;
  categories?: Category[];
  quantity?: string;
  unit?: string;
  orderId?: number;
};

export type Category = {
  id?: number;
  name?: string;
};

export type Expense = {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string;
};
