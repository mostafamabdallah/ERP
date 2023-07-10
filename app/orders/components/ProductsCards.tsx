import React, { memo } from "react";
import { SelectedItem } from "../customer/[id]/page";
import { DeleteFilled } from "@ant-design/icons";
import { Avatar, Card, Switch } from "antd";
import Meta from "antd/es/card/Meta";
type Props = {
  data: SelectedItem;
  deleteProduct: (id: number) => void;
};

const ProductsCards = ({ data, deleteProduct }: Props) => {
  return (
    <Card
      style={{ width: 300, marginTop: 16 }}
      actions={[
        <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#0f62fe20] text-primary">
          {data.quantity} <span className="ml-1">{data.unit}</span>
        </div>,
        <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#27783f20] text-[#27783f]">
          <span className="ml-1">
            {Number(data.price) * Number(data.quantity)} EG
          </span>
        </div>,
        <DeleteFilled
          onClick={() => {
            deleteProduct(Number(data.id));
          }}
          style={{
            color: "#da1e27",
          }}
          key="ellipsis"
        />,
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        }
        title={data.name}
        description={data.category}
      />
    </Card>
  );
};

export default memo(ProductsCards);
