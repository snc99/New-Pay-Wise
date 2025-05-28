// GET detail, PUT update, DELETE user

import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/validation-zod/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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

    const requestData = await req.json();

    const parsed = await userSchema.safeParseAsync({ ...requestData, id });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      {
        status: true,
        message: "User berhasil diperbarui",
        data: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui user" },
      { status: 500 }
    );
  }
}

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

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json(
      {
        status: true,
        message: "User berhasil dihapus",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus user" },
      { status: 500 }
    );
  }
}
