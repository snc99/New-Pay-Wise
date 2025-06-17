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
    const where: Prisma.UserWhereInput = {
      ...(search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
      debts: {
        some: {}, // hanya user yang punya utang
      },
    };

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
      const totalDebt = user.debts.reduce(
        (sum, debt) => sum + debt.amount.toNumber(),
        0
      );

      const totalPaid = user.debts.reduce((sum, debt) => {
        const paid = debt.payments.reduce(
          (subSum, payment) => subSum + payment.amount.toNumber(),
          0
        );
        return sum + paid;
      }, 0);

      const remaining = Math.max(totalDebt - totalPaid, 0);

      return {
        userId: user.id,
        userName: user.name,
        totalDebt,
        totalPaid,
        remaining,
        status: remaining <= 0 ? "Lunas" : "Belum Lunas",
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
