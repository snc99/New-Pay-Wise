// GET detail, PUT update, DELETE user

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { debts: true }, // kalau mau sekalian ambil data hutangnya
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, phone, address } = body;

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { name, phone, address },
  });

  return NextResponse.json(user);
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    // Contoh pathname: /api/users/123
    const parts = pathname.split("/");
    const id = parts[parts.length - 1]; // ambil id terakhir dari URL

    if (!id) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Cek apakah user dengan id tersebut ada
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({ where: { id } });

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
