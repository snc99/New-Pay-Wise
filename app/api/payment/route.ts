import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { paymentSchema } from "@/lib/validation-zod/payment";

type PaymentWithRemaining = Prisma.PaymentGetPayload<{
  include: {
    debt: {
      select: {
        id: true;
        amount: true;
        user: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}> & {
  remainingCalculated: number;
  totalRemaining: number;
};

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
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          },
        }
      : {};

    const allPayments = await prisma.payment.findMany({
      where,
      orderBy: [{ debtId: "asc" }, { paidAt: "asc" }],
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
    });

    const result: PaymentWithRemaining[] = [];
    const groupedByDebt = new Map<string, { amount: number; items: typeof allPayments }>();

    for (const p of allPayments) {
      const key = p.debt.id;
      if (!groupedByDebt.has(key)) {
        groupedByDebt.set(key, {
          amount: Number(p.debt.amount),
          items: [],
        });
      }
      groupedByDebt.get(key)!.items.push(p);
    }

    for (const [, group] of groupedByDebt.entries()) {
      let remaining = group.amount;

      for (const p of group.items) {
        remaining -= Number(p.amount);
        result.push({
          ...p,
          remainingCalculated: remaining,
          totalRemaining: 0,
        });
      }
    }

    const allDebts = await prisma.debt.findMany({
      include: {
        payments: true,
        user: true,
      },
    });

    const userRemainingMap = new Map<string, number>();
    for (const debt of allDebts) {
      const totalPaid = debt.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const remaining = Number(debt.amount) - totalPaid;
      const userId = debt.user.id;
      const prev = userRemainingMap.get(userId) || 0;
      userRemainingMap.set(userId, prev + remaining);
    }

    const enrichedResult = result.map((item) => ({
      ...item,
      totalRemaining: userRemainingMap.get(item.debt.user.id) || 0,
    }));

    const paginated = enrichedResult
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
      .slice(skip, skip + limit);

    return NextResponse.json({
      data: paginated,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(enrichedResult.length / limit),
        totalItems: enrichedResult.length,
      },
    });
  } catch (error) {
    console.error("GET /api/payment error:", error);
    return NextResponse.json({ error: "Gagal mengambil data pembayaran." }, { status: 500 });
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

    const { userId, amount, paidAt } = parsed.data;
    let remainingAmount = new Prisma.Decimal(amount);

    const debts = await prisma.debt.findMany({
      where: { userId },
      include: { payments: true },
      orderBy: { createdAt: "asc" },
    });

    const unpaidDebts = debts.filter((debt) => {
      const totalPaid = debt.payments.reduce(
        (acc, p) => acc.plus(p.amount),
        new Prisma.Decimal(0)
      );
      return debt.amount.minus(totalPaid).greaterThan(0);
    });

    if (unpaidDebts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak memiliki utang yang belum lunas.",
        },
        { status: 400 }
      );
    }

    const paymentsToCreate = [];

    for (const debt of unpaidDebts) {
      const totalPaid = debt.payments.reduce(
        (acc, p) => acc.plus(p.amount),
        new Prisma.Decimal(0)
      );
      const remainingDebt = debt.amount.minus(totalPaid);

      if (remainingDebt.lte(0)) continue;

      const paymentForThisDebt = Prisma.Decimal.min(remainingDebt, remainingAmount);

      paymentsToCreate.push({
        debtId: debt.id,
        amount: paymentForThisDebt,
        remaining: remainingDebt.minus(paymentForThisDebt),
        paidAt: new Date(paidAt),
      });

      remainingAmount = remainingAmount.minus(paymentForThisDebt);
      if (remainingAmount.lte(0)) break;
    }

    if (remainingAmount.gt(0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nominal pembayaran melebihi total sisa utang user.",
        },
        { status: 400 }
      );
    }

    const createdPayments = await prisma.$transaction(
      paymentsToCreate.map((data) => prisma.payment.create({ data }))
    );

    return NextResponse.json(
      {
        status: true,
        message: "Pembayaran berhasil dicatat",
        data: createdPayments,
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
