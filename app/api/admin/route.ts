import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, password, role } = body;

    if (![name, email, username, password].every(Boolean)) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { field: "email", message: "Email sudah digunakan" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { field: "username", message: "Username sudah digunakan" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        role: role || "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin created", data: newAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Admin Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
