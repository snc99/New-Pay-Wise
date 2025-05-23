// GET semua user dan POST user baru

import prisma from "@/lib/prisma"; // sesuaikan path
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, address } = body;

  const user = await prisma.user.create({
    data: { name, phone, address },
  });

  return NextResponse.json(user, { status: 201 });
}
