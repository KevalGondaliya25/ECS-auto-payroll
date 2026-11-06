-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "shopId" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "repairOrderId" TEXT NOT NULL,
    "repairOrderNumber" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "labourId" TEXT NOT NULL,
    "labourName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
