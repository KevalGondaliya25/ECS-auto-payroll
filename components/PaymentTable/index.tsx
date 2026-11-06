import { PaymentType } from "@/utils/types";
import { Table } from "antd";
import dayjs from "dayjs";
import React from "react";

function PaymentTable({ dataSource }: { dataSource: Array<PaymentType> }) {
  const columns = [
    {
      title: "Labour Id",
      dataIndex: "labourId",
      key: "labourId",
    },
    {
      title: "Paid",
      dataIndex: "amount",
      key: "amount",
      render: (_: PaymentType, record: PaymentType) => {
        return <>$ {record.amount}</>;
      },
    },
    {
      title: "Paid Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: PaymentType, record: PaymentType) => {
        return <>{dayjs(record.createdAt).format("DD MMM YYYY hh:mm A")}</>;
      },
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  return (
    <div className="w-full">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
}

export default PaymentTable;
