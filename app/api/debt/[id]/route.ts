import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const existingDebt = await prisma.debt.findUnique({
      where: { id },
    });

    if (!existingDebt) {
      return NextResponse.json(
        { message: "Data utang tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah debt sudah ada payment terkait
    const paymentCount = await prisma.payment.count({
      where: { debtId: id },
    });

    if (paymentCount > 0) {
      return NextResponse.json(
        {
          message: "Utang tidak bisa dihapus karena pembayaran belum selesai.",
        },
        { status: 400 }
      );
    }

    await prisma.debt.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Data utang berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus data utang:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus data utang" },
      { status: 500 }
    );
  }
}
