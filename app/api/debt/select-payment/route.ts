import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua utang dengan user dan payments
    const debts = await prisma.debt.findMany({
      include: {
        user: true,
        payments: true,
      },
    });

    // Kumpulkan dan jumlahkan sisa utang per user
    const userMap = new Map<
      string,
      { userName: string; totalRemaining: number }
    >();

    debts.forEach((debt) => {
      const totalPaid = debt.payments.reduce(
        (sum, p) => sum + p.amount.toNumber(),
        0
      );
      const remaining = debt.amount.toNumber() - totalPaid;

      if (remaining > 0) {
        const userId = debt.user.id;
        const existing = userMap.get(userId);

        if (existing) {
          existing.totalRemaining += remaining;
        } else {
          userMap.set(userId, {
            userName: debt.user.name,
            totalRemaining: remaining,
          });
        }
      }
    });

    const result = Array.from(userMap.entries()).map(([userId, data]) => ({
      userId,
      ...data,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DEBT_SELECT_PAYMENT]", error);
    return NextResponse.json(
      { message: "Gagal mengambil data untuk select pembayaran" },
      { status: 500 }
    );
  }
}
