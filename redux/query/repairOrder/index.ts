import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RepairOrderType, ResponsePaginationType } from "@/utils/types";

export const repairOrderApi = createApi({
  reducerPath: "repairOrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    GetAllRepairOrders: builder.query<
      ResponsePaginationType<Array<RepairOrderType>>,
      {
        id: number;
        page: number;
        pageSize: number;
        technicianId?: number;
        start?: string;
        invoiceType?: string;
      }
    >({
      query: ({ id, page, technicianId, start, invoiceType, pageSize }) => {
        let url = `/repair-orders?shop=${id}&page=${page}&pageSize=${pageSize}`;
        if (technicianId) url += `&technicianId=${technicianId}`;
        if (start) url += `&start=${start}`;
        if (invoiceType) url += `&invoiceType=${invoiceType}`;

        return {
          url: url,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLazyGetAllRepairOrdersQuery } = repairOrderApi;
