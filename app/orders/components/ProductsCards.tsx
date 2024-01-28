import React, { memo } from "react";
import { DeleteFilled } from "@ant-design/icons";
import { Avatar, Button, Card, Col, InputNumber, Row } from "antd";
import Meta from "antd/es/card/Meta";

const ProductsCards = ({ data }: any) => {
  return (
    <Card
      style={{ width: 300, marginTop: 16 }}
      actions={[
        <>
          <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#0f62fe20] text-primary">
            {data.quantity} <span className="ml-1">{data.unit}</span>
          </div>
          ,
          <div className="inline-flex items-center font-semibold   text-base px-2 py-0.5 rounded-sm bg-[#27783f20] text-[#27783f]">
            <span className="ml-1">
              {Number(data.price) * Number(data.quantity)} EG
            </span>
          </div>
        </>,
        <DeleteFilled
          onClick={() => {}}
          style={{
            color: "#da1e27",
          }}
          key="ellipsis"
        />,
      ]}
    >
      <Row>
        <Col span={12}>
          {" "}
          <Meta
            avatar={
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
            }
            title={data.name}
            description={data.category}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default memo(ProductsCards);
