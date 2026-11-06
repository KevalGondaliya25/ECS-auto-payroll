import { DescriptionType } from "@/utils/types";
import { Table } from "antd";
import React from "react";

function Description({ dataSource }: { dataSource: Array<DescriptionType> }) {
  const columns = [
    {
      title: "Item #",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div className="w-full">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
}

export default Description;
