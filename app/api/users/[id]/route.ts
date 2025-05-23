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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
