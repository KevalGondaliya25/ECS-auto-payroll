"use server";
import { getBearerToken, getShops } from "@/utils/api";
import { Response } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token: string = await getBearerToken();

    const shops = await getShops(token);

    return NextResponse.json(Response(true, "Get shops successfully.", shops), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      { status: false, message: "Internal server error.", data: null },
      { status: 500 }
    );
  }
}
