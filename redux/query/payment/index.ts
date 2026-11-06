import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PaymentBodyType, PaymentResponseType, Response } from "@/utils/types";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    pay: builder.mutation<Response<PaymentResponseType>, PaymentBodyType>({
      query: (body) => ({
        url: "/payment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { usePayMutation } = paymentApi;
