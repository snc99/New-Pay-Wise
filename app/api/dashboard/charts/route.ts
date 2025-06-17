// app/api/dashboard-charts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  try {
    // Chart 1: Total utang vs pembayaran per user
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { debts: { some: {} } }, // punya utang
          {
            debts: {
              some: {
                payments: {
                  some: {},
                },
              },
            },
          },
        ],
      },
      include: {
        debts: {
          include: {
            payments: true,
          },
        },
      },
    });

    const chart1Data = users.map((user) => {
      const totalDebt = user.debts.reduce(
        (acc, debt) => acc + Number(debt.amount),
        0
      );
      const totalPayment = user.debts.reduce(
        (acc, debt) =>
          acc + debt.payments.reduce((sum, p) => sum + Number(p.amount), 0),
        0
      );
      return {
        name: user.name,
        totalDebt,
        totalPayment,
      };
    });

    // Chart 2: Tren pembayaran harian
    const payments = await prisma.payment.findMany({
      where: {
        paidAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: {
        paidAt: true,
        amount: true,
      },
    });

    const trendMap: Record<string, number> = {};

    payments.forEach((payment) => {
      const date = startOfDay(payment.paidAt).toISOString().split("T")[0];
      trendMap[date] = (trendMap[date] || 0) + Number(payment.amount);
    });

    const chart2Data = Object.entries(trendMap).map(([date, totalPayment]) => ({
      date,
      totalPayment,
    }));

    return NextResponse.json({ chart1: chart1Data, chart2: chart2Data });
  } catch (error) {
    console.error("Error fetching dashboard charts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
