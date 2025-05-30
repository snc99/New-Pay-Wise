import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 7;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.UserWhereInput = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          debts: {
            include: {
              payments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const summary = users.map((user) => {
      let totalPaid = 0;
      let totalRemaining = 0;

      user.debts.forEach((debt) => {
        const debtAmount = debt.amount.toNumber();
        const paidAmount = debt.payments.reduce(
          (sum, payment) => sum + payment.amount.toNumber(),
          0
        );
        const remaining = debtAmount - paidAmount;

        totalRemaining += remaining > 0 ? remaining : 0;
        totalPaid += paidAmount;
      });

      return {
        userId: user.id,
        userName: user.name,
        totalDebt: totalRemaining,
        totalPaid,
        remaining: totalRemaining,
        status: totalRemaining <= 0 ? "Lunas" : "Belum Lunas",
      };
    });

    return NextResponse.json({
      data: summary,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
      },
    });
  } catch (error) {
    console.error("[SUMMARY_API_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal mengambil ringkasan utang." },
      { status: 500 }
    );
  }
}
