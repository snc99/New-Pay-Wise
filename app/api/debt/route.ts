import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { debtSchema } from "@/lib/validation-zod/debt";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 7;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.DebtWhereInput = search
      ? {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }
      : {};

    const [debts, totalDebts] = await Promise.all([
      prisma.debt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.debt.count({ where }),
    ]);

    return NextResponse.json({
      data: debts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDebts / limit),
        totalItems: totalDebts,
      },
    });
  } catch (error) {
    console.error("GET /api/debt error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data utang." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = debtSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors[0];
      return NextResponse.json(
        {
          success: false,
          message: errorMessage.message,
        },
        { status: 400 }
      );
    }

    const { userId, amount, date } = parsed.data;

    const newDebt = await prisma.debt.create({
      data: {
        userId,
        amount: new Prisma.Decimal(amount),
        date: new Date(date),
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Berhasil menambahkan hutang",
        data: newDebt,
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error("POST /api/debt error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "User yang dipilih tidak ditemukan." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan utang." },
      { status: 500 }
    );
  }
}
