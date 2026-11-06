"use server";
import { NextRequest, NextResponse } from "next/server";
import { Response } from "@/utils/response";
import { PaymentBodyType } from "@/utils/types";
import { prisma } from "@/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const body: PaymentBodyType = await req.json();
    const payment = await prisma.payment.create({
      data: {
        shopId: body.shopId,
        shopName: body.shopName,
        employeeId: body.employeeId,
        employeeEmail: body.employeeEmail,
        repairOrderId: body.repairOrderId,
        repairOrderNumber: body.repairOrderNumber,
        jobId: body.jobId,
        jobName: body.jobName,
        labourId: body.labourId,
        labourName: body.labourName,
        comment: body.comment,
        amount: body.amount,
      },
    });

    return NextResponse.json(
      Response(true, "Payment pay successfully.", payment),
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      { status: false, message: "Internal server error.", data: null, err },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
