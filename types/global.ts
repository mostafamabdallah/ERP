import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { type } from "os";

export type CardData = {
  title: string;
  icon: IconDefinition;
  iconColor: string;
  iconBgColor: string;
  value: number;
  delta?: number;
  curancy?: string;
  period?: string;
};

export type Customer = {
  id: number;
  name: string;
  adress: string;
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
  status?: string;
  unit?: string;
  orderId?: number;
};
