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
        some: {}, // tambahkan ini
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
            orderBy: { createdAt: "desc" }, // ambil utang terbaru
            take: 1, // hanya 1 per user
            include: {
              payments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const summary = users.map((user) => {
      const latestDebt = user.debts[0];

      if (!latestDebt) {
        return {
          userId: user.id,
          userName: user.name,
          totalDebt: 0,
          totalPaid: 0,
          remaining: 0,
          status: "Lunas",
        };
      }

      const totalDebt = latestDebt.amount.toNumber();
      const totalPaid = latestDebt.payments.reduce(
        (sum, p) => sum + p.amount.toNumber(),
        0
      );
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
