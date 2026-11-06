import { cookies } from "next/headers";
import axios from "axios";
import qs from "qs";
import {
  AuthResponseType,
  EmployeesType,
  Pagination,
  RepairOrderType,
  Response,
  ShopType,
} from "@/utils/types";

export const DOMAIN = `${process.env.BACKEND_URL}/api/v1`;

/**
 *
 * @returns Auth apis
 */
export const getBearerToken = async (): Promise<string> => {
  return new Promise(async (resolve, rejects) => {
    try {
      const cookieStore = cookies();
      const hasToken = (await cookieStore).has("bearerToken");

      if (!hasToken) {
        await getToken();
      }

      const token = (await cookieStore).get("bearerToken");

      resolve(`bearer ${token?.value}`);
    } catch (error) {
      rejects(error);
    }
  });
};

export const getToken = async (): Promise<void> => {
  return new Promise(async (resolve, rejects) => {
    try {
      const token = btoa(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      );
      const response = await axios.post<void, Response<AuthResponseType>>(
        `${DOMAIN}/oauth/token`,
        qs.stringify({ grant_type: "client_credentials" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${token}`,
          },
        }
      );

      const cookieStore = cookies();
      (await cookieStore).set("bearerToken", response.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      resolve();
    } catch (error) {
      rejects(error);
    }
  });
};

/**
 *
 * @returns Shop apis
 */

export const getShops = async (token: string): Promise<Array<ShopType>> => {
  return new Promise(async (resolve, rejects) => {
    try {
      const response = await axios.get<void, Response<Array<ShopType>>>(
        `${DOMAIN}/shops`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      resolve(response.data);
    } catch (error) {
      rejects(error);
    }
  });
};

/**
 *
 * @returns Employee apis
 */

export const getEmployees = async (
  token: string,
  id: number,
  page: number
): Promise<Pagination<EmployeesType>> => {
  return new Promise(async (resolve, rejects) => {
    try {
      const response = await axios.get<
        void,
        Response<Pagination<EmployeesType>>
      >(`${DOMAIN}/employees?shop=${id}&size=100&page=${page}`, {
        headers: {
          Authorization: token,
        },
      });

      resolve(response.data);
    } catch (error) {
      console.log("error : ", error);
      rejects(error);
    }
  });
};

/**
 *
 * @returns Repair Orders apis
 */

export const getRepairOrders = async (
  token: string,
  id: number,
  page: number,
  pageSize: number,
  start: string | null
): Promise<Pagination<RepairOrderType>> => {
  return new Promise(async (resolve, rejects) => {
    try {
      let query = `shop=${id}&size=${pageSize}&sort=repairOrderNumber&sortDirection=DESC&page=${page}`;
      if (start) query += `&start=${encodeURIComponent(start)}`;

      const response = await axios.get<
        void,
        Response<Pagination<RepairOrderType>>
      >(`${DOMAIN}/repair-orders?${query}`, {
        headers: {
          Authorization: token,
        },
      });

      resolve(response.data);
    } catch (error) {
      rejects(error);
    }
  });
};
