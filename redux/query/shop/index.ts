import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Response, ShopType } from "@/utils/types";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    GetAllShops: builder.query<Response<Array<ShopType>>, void>({
      query: () => {
        return {
          url: "/shop",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAllShopsQuery } = shopApi;
