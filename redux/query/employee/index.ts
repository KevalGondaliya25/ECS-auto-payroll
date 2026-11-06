import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EmployeesType, Response } from "@/utils/types";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    GetAllEmployees: builder.query<
      Response<Array<EmployeesType>>,
      { id: number | null }
    >({
      query: ({ id }) => {
        return {
          url: `/employees?shop=${id}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLazyGetAllEmployeesQuery } = employeeApi;
