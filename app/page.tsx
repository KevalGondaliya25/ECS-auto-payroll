"use client";
import React, { Key, useEffect, useState } from "react";
import {
  Radio,
  Select,
  Table,
  RadioChangeEvent,
  Button,
  DatePicker,
  DatePickerProps,
  Modal,
  Input,
  Tooltip,
} from "antd";
import type { Dayjs } from "dayjs";
import { useGetAllShopsQuery } from "@/redux/query/shop";
import Description from "@/components/Description";
import PaymentTable from "@/components/PaymentTable";
import {
  DescriptionType,
  EmployeesType,
  PaymentType,
  RepairOrderExpandTableType,
  RepairOrderTableType,
  ShopType,
  TablePaginationType,
} from "@/utils/types";
import { useLazyGetAllEmployeesQuery } from "@/redux/query/employee";
import { TablePaginationConfig } from "antd/es/table/interface";
import { useLazyGetAllRepairOrdersQuery } from "@/redux/query/repairOrder";
import _ from "lodash";
import { getTimezoneOffsetString } from "@/utils/utilFactions";
import { usePayMutation } from "@/redux/query/payment";

const Home = () => {
  const [shops, setShops] = useState<Array<ShopType>>([]);
  const [employees, setEmployees] = useState<Array<EmployeesType>>([]);
  const [shopId, setShopId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [invoiceSelect, setInvoiceSelect] = useState<string>("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [tableData, setTableData] = useState<Array<RepairOrderTableType>>([]);
  const [pagination, setPagination] = useState<TablePaginationType>({
    current: 0,
    pageSize: 10,
    total: 0,
  });
  const [amount, setAmount] = useState<number>();
  console.log("amount : ", amount);
  const [comment, setComment] = useState<string>("");
  const [paymentInfo, setPaymentInfo] =
    useState<RepairOrderExpandTableType | null>(null);

  const [laborData, setLaborData] = useState<Array<DescriptionType>>([]);
  const [paymentData, setPaymentData] = useState<Array<PaymentType>>([]);

  const { data: shopData, isLoading: shopLoading } = useGetAllShopsQuery();
  const [pay, { isLoading: payLoading }] = usePayMutation();
  const [
    triggerEmployees,
    { data: employeesData, isLoading: employeesLoading },
  ] = useLazyGetAllEmployeesQuery();
  const [
    triggerRepairOrders,
    {
      data: repairOrderData,
      isLoading: repairOrderLoading,
      isFetching: repairOrderFetching,
    },
  ] = useLazyGetAllRepairOrdersQuery();

  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      let labors: Array<DescriptionType> = [];
      let laborPaid: Array<PaymentType> = [];
      tableData
        .filter((data) => selectedRowKeys.includes(data.key))
        .map((data) => {
          labors = [
            ...labors,
            ...data.labor.map((lab) => ({
              item: lab.laborId,
              key: lab.laborId,
              description: lab.laborName,
            })),
          ];

          data.labor.map((lab) => {
            lab.payment.map((pay) => {
              laborPaid.push({
                key: pay.id,
                labourId: lab.laborId,
                amount: pay.amount,
                comment: pay.comment,
                createdAt: pay.createdAt,
              });
            });
          });
        });
      setLaborData(labors);
      setPaymentData(laborPaid);
    } else {
      setLaborData([]);
      setPaymentData([]);
    }
  }, [selectedRowKeys, tableData]);

  useEffect(() => {
    if (shopId) {
      setEmployeeId(null);
      setTableData([]);
      triggerEmployees({ id: shopId });
    }
  }, [shopId]);

  useEffect(() => {
    if (shopId && employeeId) {
      setTableData([]);
      triggerRepairOrders({
        id: shopId,
        technicianId: employeeId,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
  }, [employeeId]);

  useEffect(() => {
    if (shopData && shopData.status) {
      setShops(shopData.data);
    }
  }, [shopData]);

  useEffect(() => {
    if (employeesData && employeesData.status) {
      setEmployees(employeesData.data);
    }
  }, [employeesData]);

  useEffect(() => {
    if (
      repairOrderData &&
      repairOrderData.status &&
      repairOrderData.data.length > 0
    ) {
      setTableData((prev) => []);
      repairOrderData.data.map((orderData) => {
        let jobTotalAmount = 0;
        let jobTotalPaidAmount = 0;

        let jobTotalHours = 0;
        let jobPaidHours = 0;

        const laborData: Array<RepairOrderExpandTableType> = [];
        orderData.jobs.map((job) => {
          jobTotalAmount += job.laborTotal / 100;
          jobTotalHours += job.laborHours;

          job.labor.map((lab) => {
            if (lab.payment.length > 0) {
              jobTotalPaidAmount += lab.payment.reduce(
                (sum, payment) => sum + Number(payment.amount),
                0
              );
              jobPaidHours += lab.hours;
            }
            laborData.push({
              key: lab.id,
              repairOrderId: orderData.id,
              repairOrderNumber: orderData.repairOrderNumber,
              jobId: job.id,
              jobName: job.name,
              laborId: lab.id,
              laborName: lab.name,
              hours: lab.hours,
              rate: lab.rate / 100,
              complete: lab.complete,
              paymentStatus: lab.paymentStatus,
              payment: lab.payment,
              paidPayment: lab.payment.reduce(
                (currentValue, { amount }) => amount + currentValue,
                0
              ),
            });
          });
        });
        setTableData((prev) =>
          _.unionBy(
            [
              ...prev,
              {
                repairOrder: orderData.repairOrderNumber,
                key: orderData.id,
                totalDue: `$ ${(jobTotalAmount - jobTotalPaidAmount).toFixed(
                  2
                )}`,
                laborHours: Number(jobTotalHours.toFixed(2)),
                laborPaidHours: Number(jobPaidHours.toFixed(2)),
                laborDueHours: Number(
                  (jobTotalHours - jobPaidHours).toFixed(2)
                ),
                repairOrderStatus: orderData.repairOrderStatus.name,
                labor: laborData,
              },
            ].sort((a, b) => b.repairOrder - a.repairOrder),
            "repairOrder"
          )
        );
      });
      setPagination({
        current: repairOrderData.current,
        pageSize: repairOrderData.pageSize,
        total: repairOrderData.total,
      });
    } else {
      setTableData([]);
    }
  }, [repairOrderData, repairOrderFetching]);

  const onChangeDatePicker: DatePickerProps<Dayjs[]>["onChange"] = (
    date,
    dateString
  ) => {
    setTableData([]);
    const startDate = new Date(dateString as string);
    const year = startDate.getUTCFullYear();
    const month = String(startDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(startDate.getUTCDate()).padStart(2, "0");
    const offset = getTimezoneOffsetString();
    const formattedDate = `${year}-${month}-${day}T00:00${offset}`;
    if (shopId && employeeId) {
      triggerRepairOrders({
        id: shopId,
        technicianId: employeeId,

        start: Boolean(dateString && dateString !== "")
          ? encodeURIComponent(formattedDate)
          : undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onRefresh = (): void => {
    if (shopId && employeeId) {
      setTableData([]);
      triggerRepairOrders({
        id: shopId,
        technicianId: employeeId,
        page: 0,
        pageSize: pagination.pageSize,
      });
    }
  };
  const onRadioChange = (e: RadioChangeEvent) => {
    if (shopId && employeeId) {
      setInvoiceSelect(e.target.value);
      if (e.target.value === "all") {
        triggerRepairOrders({
          id: shopId,
          technicianId: employeeId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        triggerRepairOrders({
          id: shopId,
          technicianId: employeeId,
          page: pagination.current,
          pageSize: pagination.pageSize,
          invoiceType: e.target.value,
        });
      }
    }
  };

  const handleTableChange = (paginationData: TablePaginationConfig) => {
    if (shopId && employeeId) {
      setPagination((prev) => ({
        ...prev,
        current: paginationData.current! - 1,
        pageSize: paginationData.pageSize!,
      }));
      triggerRepairOrders({
        id: shopId,
        technicianId: employeeId,
        page: paginationData.current! - 1,
        pageSize: paginationData.pageSize!,
      });
    }
  };

  const expandColumns = [
    { title: "Job Id", dataIndex: "jobId", key: "jobId" },
    { title: "Job Name", dataIndex: "jobName", key: "jobName" },
    { title: "Labor Id", dataIndex: "laborId", key: "laborId" },
    { title: "Labor Name", dataIndex: "laborName", key: "laborName" },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
    },
    {
      title: "Rate per Hours",
      dataIndex: "rate",
      key: "rate",
      render: (
        _: RepairOrderExpandTableType,
        record: RepairOrderExpandTableType
      ) => {
        return <>$ {record.rate}</>;
      },
    },
    {
      title: "Action",
      key: "operation",
      render: (
        _: RepairOrderExpandTableType,
        record: RepairOrderExpandTableType
      ) => {
        return (
          <Button
            disabled={
              record.paymentStatus ||
              Boolean(record?.paidPayment! >= record?.rate! * record?.hours!)
            }
            onClick={() => setPaymentInfo(record)}
          >
            Pay Now
          </Button>
        );
      },
    },
  ];

  const columns = [
    {
      title: "Repair Order",
      dataIndex: "repairOrder",
      key: "id",
    },
    {
      title: "Total Due",
      dataIndex: "totalDue",
      key: "totalDue",
    },
    {
      title: "Total Hours",
      dataIndex: "laborHours",
      key: "laborHours",
    },
    {
      title: "Total Paid Hours",
      dataIndex: "laborPaidHours",
      key: "laborPaidHours",
    },
    {
      title: "Total Due Hours",
      dataIndex: "laborDueHours",
      key: "laborDueHours",
    },
    {
      title: "Repair Order Status",
      dataIndex: "repairOrderStatus",
      key: "repairOrderStatus",
    },
  ];

  console.log("paymentInfo : ", paymentInfo);

  return (
    <div className="flex flex-col grow min-h-screen p-6 gap-6">
      <div className="flex md:flex-nowrap flex-wrap justify-start items-center gap-6 bg-white p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="font-wight-600">Shop</div>
          <Select
            className="w-72"
            loading={shopLoading}
            placeholder="Select a shop"
            onChange={(data) => setShopId(data)}
            options={
              shops.length > 0
                ? shops.map((shop, index) => ({
                    value: shop.id,
                    label: <span key={index}>{shop.name}</span>,
                  }))
                : []
            }
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="font-wight-600">Employee</div>
          <Select
            loading={employeesLoading}
            className={`w-40`}
            disabled={shopId === null}
            placeholder="Select a employee"
            onChange={(data) => setEmployeeId(data)}
            options={
              employees.length > 0
                ? employees.map((employee, index) => ({
                    value: employee.id,
                    label: (
                      <span
                        key={index}
                      >{`${employee.firstName} ${employee.lastName}`}</span>
                    ),
                  }))
                : []
            }
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="font-wight-600">From Date</div>
          <DatePicker
            onChange={onChangeDatePicker}
            disabled={!(shopId && employeeId)}
          />
          <Button
            onClick={onRefresh}
            disabled={!(shopId && employeeId)}
            loading={repairOrderLoading}
          >
            Refresh
          </Button>
        </div>
        <Radio.Group
          onChange={onRadioChange}
          value={invoiceSelect}
          disabled={!(shopId && employeeId)}
        >
          <Radio value={"all"}>All Invoices</Radio>
          <Radio value={"partial"}>Partial / Unpaid Invoices</Radio>
          <Radio value={"paid"}>Paid Invoices</Radio>
        </Radio.Group>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        loading={repairOrderLoading || repairOrderFetching}
        onExpandedRowsChange={(expandedRows) => onSelectChange(expandedRows)}
        expandRowByClick={true}
        className="overflow-auto"
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={expandColumns}
              dataSource={record.labor}
              pagination={false}
            />
          ),
          rowExpandable: (record) => record.labor && record.labor.length > 0,
        }}
        sticky
        pagination={{
          className: "pagination",
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
      <div className="flex md:flex-nowrap flex-wrap justify-start gap-6">
        <Description dataSource={laborData} />
        <PaymentTable dataSource={paymentData} />
      </div>
      <Modal
        title={<div className="text-lg font-bold">Payment Info</div>}
        centered
        open={Boolean(paymentInfo)}
        okText={"Pay Now"}
        loading={payLoading}
        okButtonProps={{
          disabled:
            Boolean(!amount) ||
            Boolean(amount && amount < 0) ||
            Boolean(
              amount &&
                amount >
                  paymentInfo?.rate! * paymentInfo?.hours! -
                    paymentInfo?.paidPayment!
            ) ||
            Boolean(
              paymentInfo?.paidPayment! >=
                paymentInfo?.rate! * paymentInfo?.hours!
            ),
        }}
        onOk={() => {
          if (paymentInfo && shopId && employeeId)
            pay({
              shopId: `${shopId}`,
              shopName: shops.find((shop) => shop.id === shopId)?.name || "",
              employeeId: `${employeeId}`,
              employeeEmail:
                employees.find((employ) => employ.id === employeeId)?.email ||
                "",
              repairOrderId: `${paymentInfo.repairOrderId}`,
              repairOrderNumber: `${paymentInfo.repairOrderNumber}`,
              jobId: `${paymentInfo.jobId}`,
              jobName: paymentInfo.jobName,
              labourId: `${paymentInfo.laborId}`,
              labourName: paymentInfo.laborName,
              amount: Number(amount),
              comment: comment,
            });
          if (shopId && employeeId)
            triggerRepairOrders({
              id: shopId,
              technicianId: employeeId,
              page: pagination.current,
              pageSize: pagination.pageSize,
            });
          setLaborData([]);
          setPaymentData([]);
          setPaymentInfo(null);
          setAmount(undefined);
          setComment("");
        }}
        onCancel={() => {
          setPaymentInfo(null);
          setAmount(undefined);
          setComment("");
        }}
      >
        <div className="font-medium text-base pb-1">
          <span>Repair Order ID : </span>
          <span className="font-normal text-sm">
            {paymentInfo?.repairOrderNumber}
          </span>
        </div>
        <div className="font-medium text-base pb-1 overflow-hidden truncate max-w-[472px] w-full">
          <span>Job : </span>
          <span className="font-normal text-sm text-ellipsis">
            {paymentInfo?.jobName}
          </span>
        </div>
        <div className="font-medium text-base pb-1 truncate max-w-[472px] w-full">
          <span>Labour : </span>
          <span className="font-normal text-sm ">{paymentInfo?.laborName}</span>
        </div>
        <div className="font-medium text-base pb-1">
          <span>Per Hour Rate : </span>
          <span className="font-normal text-sm ">$ {paymentInfo?.rate}</span>
        </div>
        <div className="font-medium text-base pb-1">
          <span>
            {paymentInfo && paymentInfo.hours > 1 ? "Hours" : "Hour"} :{" "}
          </span>
          <span className="font-normal text-sm ">{paymentInfo?.hours}</span>
        </div>
        <div className="font-medium text-base pb-1">
          <span>Total Amount : </span>
          <span className="font-normal text-sm ">
            $ {paymentInfo?.rate! * paymentInfo?.hours!}
          </span>
        </div>
        <div className="font-medium text-base pb-1">
          <span>Paid Amount : </span>
          <span className="font-normal text-sm ">
            $ {paymentInfo?.paidPayment!}
          </span>
        </div>
        <div className="font-medium text-base pb-1">
          <span>Due Amount : </span>
          <span className="font-normal text-sm ">
            ${" "}
            {paymentInfo?.rate! * paymentInfo?.hours! -
              paymentInfo?.paidPayment!}
          </span>
        </div>
        <div className="flex pb-1 gap-1 h-8">
          <span className="font-medium text-base w-24">Amount : </span>
          <Tooltip
            trigger={["focus"]}
            title={
              Boolean(
                amount &&
                  amount >
                    paymentInfo?.rate! * paymentInfo?.hours! -
                      paymentInfo?.paidPayment!
              )
                ? `Pay amount not more that $ ${
                    paymentInfo?.rate! * paymentInfo?.hours! -
                    paymentInfo?.paidPayment!
                  }.`
                : "Enter pay amount."
            }
            placement="topRight"
          >
            <Input
              type="number"
              placeholder="Enter pay amount"
              value={amount}
              status={
                amount &&
                Boolean(
                  amount >
                    paymentInfo?.rate! * paymentInfo?.hours! -
                      paymentInfo?.paidPayment!
                )
                  ? "error"
                  : undefined
              }
              min={0}
              max={
                paymentInfo?.rate! * paymentInfo?.hours! -
                paymentInfo?.paidPayment!
              }
              onChange={(event) => {
                const value: string = event.currentTarget.value;
                setAmount(value === "" ? undefined : Number(value));
              }}
            />
          </Tooltip>
        </div>
        <div className="flex pb-1 gap-1 h-8">
          <span className="font-medium text-base w-28">Comment : </span>
          <Input
            type="text"
            placeholder="Enter a Comment"
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
