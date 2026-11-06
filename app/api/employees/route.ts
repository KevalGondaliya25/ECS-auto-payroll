"use server";
import { getBearerToken, getEmployees } from "@/utils/api";
import { Response } from "@/utils/response";
import { EmployeesType } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const shop = searchParams.get("shop");
    if (!searchParams.has("shop") || shop === "null")
      return NextResponse.json(
        { status: false, message: "Shop not found", data: null },
        { status: 400 }
      );

    const shopId: number = Number(searchParams.get("shop"));

    const token: string = await getBearerToken();

    let totalShops: Array<EmployeesType> = [];
    const { content, totalPages } = await getEmployees(token, shopId, 0);
    totalShops = [...totalShops, ...content];

    if (totalPages > 1)
      await Promise.all(
        Array.from({ length: totalPages }, (_, i) => i)
          .filter((value) => value !== 0)
          .map(async (value) => {
            const { content } = await getEmployees(token, shopId, value);
            totalShops = [...totalShops, ...content];
          })
      );

    return NextResponse.json(
      Response(true, "Get employees successfully.", totalShops),
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      { status: false, message: "Internal server error.", data: null },
      { status: 500 }
    );
  }
}
