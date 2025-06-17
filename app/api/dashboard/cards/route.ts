import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();

    const totalPayments = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    const totalDebts = await prisma.debt.aggregate({
      _sum: { amount: true },
    });

    const totalPaidUsers = await prisma.user.count({
      where: {
        debts: {
          some: {
            payments: {
              some: {},
            },
          },
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalPayments: totalPayments._sum.amount || 0,
      totalDebts: totalDebts._sum.amount || 0,
      totalPaidUsers,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
