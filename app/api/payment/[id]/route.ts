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

    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { message: "Data pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Data pembayaran berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus data pembayaran:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus data pembayaran" },
      { status: 500 }
    );
  }
}
