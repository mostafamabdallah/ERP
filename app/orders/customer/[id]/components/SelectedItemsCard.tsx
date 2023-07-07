import React from "react";
import {
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Switch } from "antd";

const { Meta } = Card;
import { SelectedItem } from "../page";

type Props = { data: SelectedItem };

const SelectedItemsCard = ({ data }: Props) => {
  return (
    <>
      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={[
          <DeleteOutlined className="flex"  key="ellipsis" />,
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
    </>
  );
};

export default SelectedItemsCard;

{
  /* <li
key={i}
className="  bg-white px-4 py-3 rounded-lg shadow "
>
<div className="flex items-center gap-5">
  <div className="flex-shrink-0 text-primary bg-[#0f62fe20]  flex items-center justify-center p-3 rounded-full">
    <FontAwesomeIcon
      className="text-2xl"
      icon={faBoxOpen}
    ></FontAwesomeIcon>
  </div>
  <div className="flex-1 min-w-0">
    <p className=" font-medium text-gray-900 truncate text-3xl">
      {el.name}
    </p>
    <p className=" text-gray-500 truncate dark:text-gray-400 text-base">
      {el.category}
    </p>
  </div>
  <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#0f62fe20] text-primary">
    {el.quantity} <span className="ml-1">{el.unit}</span>
  </div>
  <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#27783f20] text-[#27783f]">
    <span className="ml-1">
      {Number(el.price) * Number(el.quantity)} EG
    </span>
  </div>
  <div
    onClick={() => {
      dispatch({
        type: "REMOVEITEM",
        payload: { id: i, selectedItems },
      });
    }}
    className="inline-flex items-center font-semibold cursor-pointer   text-base    text-[#da1e27]"
  >
    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
  </div>
</div>
</li> */
}
