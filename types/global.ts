import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { type } from "os";

export type CardData = {
  title: string;
  icon: IconDefinition;
  iconColor: string;
  iconBgColor: string;
  value: number;
  delta?: number;
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

export type Order = {
  id: number;
  items: Item[];
  authorId: number;
};

export type Item = {
  id: number;
  name: string;
  price: number;
  category?: string;
  quantity?: string;
  unit?: string;
  orderId?: number;
};

export type Category = {
  id: number;
  name: string;
};
