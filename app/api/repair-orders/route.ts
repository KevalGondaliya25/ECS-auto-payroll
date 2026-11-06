"use server";
import { getBearerToken, getRepairOrders } from "@/utils/api";
import { Response } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const shop = searchParams.get("shop");
    const page = Number(searchParams.get("page")) || 0;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const start = searchParams.get("start") || null;
    const invoiceType = searchParams.get("invoiceType") || null;

    if (!searchParams.has("shop") || shop === "null")
      return NextResponse.json(
        { status: false, message: "Shop not found", data: null },
        { status: 400 }
      );

    const shopId: number = Number(searchParams.get("shop"));

    const token: string = await getBearerToken();

    let { content, totalPages, pageable } = await getRepairOrders(
      token,
      shopId,
      page,
      pageSize,
      start
    );

    const allPayments = await prisma.payment.findMany({
      where: {
        repairOrderId: {
          in: content.map((repairOrder) => `${repairOrder.id}`),
        },
      },
    });

    content = await Promise.all(
      content.map(async (repairOrder) => {
        repairOrder.jobs = await Promise.all(
          repairOrder.jobs.map(async (job) => {
            job.labor = await Promise.all(
              job.labor.map(async (lab) => {
                const payments = allPayments.filter(
                  (payment) =>
                    payment.repairOrderId === `${repairOrder.id}` &&
                    payment.jobId === `${job.id}` &&
                    payment.labourId === `${lab.id}`
                );

                const totalPayment = payments.reduce(
                  (sum, payment) => sum + Number(payment.amount),
                  0
                );

                const paymentStatus =
                  lab.rate * lab.hours === totalPayment * 100;

                return {
                  ...lab,
                  paymentStatus,
                  payment: payments.map(
                    ({ id, amount, createdAt, comment }) => ({
                      id,
                      amount: Number(amount),
                      comment,
                      createdAt,
                    })
                  ),
                };
              })
            );
            return job;
          })
        );
        return repairOrder;
      })
    );

    if (invoiceType === "paid") {
      content = content.map((repairOrder) => {
        repairOrder.jobs = repairOrder.jobs.map((job) => {
          job.labor = job.labor.filter((lab) => lab.paymentStatus);
          return job;
        });
        return repairOrder;
      });
    } else if (invoiceType === "partial") {
      content = content.map((repairOrder) => {
        repairOrder.jobs = repairOrder.jobs.map((job) => {
          job.labor = job.labor.filter((lab) => !lab.paymentStatus);
          return job;
        });
        return repairOrder;
      });
    }
    return NextResponse.json(
      Response(
        true,
        "Get repairs orders successfully.",
        content,
        pageable.pageNumber,
        pageable.pageSize,
        totalPages
      ),
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
