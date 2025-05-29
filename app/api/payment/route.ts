import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { paymentSchema } from "@/lib/validation-zod/payment";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 7;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.PaymentWhereInput = search
      ? {
          debt: {
            is: {
              user: {
                is: {
                  name: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive, // fix here
                  },
                },
              },
            },
          },
        }
      : {};

    const [payments, totalPayments] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paidAt: "desc" },
        include: {
          debt: {
            select: {
              id: true,
              amount: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      data: payments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPayments / limit),
        totalItems: totalPayments,
      },
    });
  } catch (error) {
    console.error("GET /api/payment error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pembayaran." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);

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

    const { debtId, amount, paidAt } = parsed.data;

    // Ambil data utang sekarang
    const existingDebt = await prisma.debt.findUnique({
      where: { id: debtId },
      include: {
        payments: true,
      },
    });

    if (!existingDebt) {
      return NextResponse.json(
        {
          success: false,
          message: "Data utang tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Hitung total yang sudah dibayar
    const totalPaid = existingDebt.payments.reduce((acc, curr) => {
      return acc.plus(curr.amount);
    }, new Prisma.Decimal(0));

    const remaining = existingDebt.amount.minus(totalPaid).minus(amount);

    if (remaining.isNegative()) {
      return NextResponse.json(
        {
          success: false,
          message: "Nominal pembayaran melebihi sisa utang",
        },
        { status: 400 }
      );
    }

    const newPayment = await prisma.payment.create({
      data: {
        debtId,
        amount: new Prisma.Decimal(amount),
        remaining,
        paidAt: new Date(paidAt),
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Pembayaran berhasil dicatat",
        data: newPayment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/payment error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mencatat pembayaran.",
      },
      { status: 500 }
    );
  }
}
