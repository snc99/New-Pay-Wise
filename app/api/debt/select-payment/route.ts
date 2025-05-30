import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua utang yang masih punya sisa (utang - total pembayaran > 0)
    const debts = await prisma.debt.findMany({
      include: {
        user: true,
        payments: true,
      },
    });

    const result = debts
      .map((debt) => {
        const totalPaid = debt.payments.reduce(
          (sum, payment) => sum + payment.amount.toNumber(),
          0
        );
        const remainingDebt = debt.amount.toNumber() - totalPaid;

        return {
          id: debt.id,
          userName: debt.user.name,
          originalAmount: debt.amount,
          paidAmount: totalPaid,
          remainingDebt,
        };
      })
      .filter((item) => item.remainingDebt > 0); // hanya utang yang belum lunas

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DEBT_SELECT_PAYMENT]", error);
    return NextResponse.json(
      { message: "Gagal mengambil data untuk select pembayaran" },
      { status: 500 }
    );
  }
}
