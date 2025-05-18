import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // <-- await dulu
  const adminId = resolvedParams.id;

  const body = await req.json();
  const { name, email, username, role } = body;

  // Validasi dasar (bisa ditambahkan lebih lanjut)
  if (!name || !email || !username || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: {
        name,
        email,
        username,
        role,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // tunggu params
  const adminId = resolvedParams.id;

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { message: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.admin.delete({
      where: { id: adminId },
    });

    return NextResponse.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menghapus admin" },
      { status: 500 }
    );
  }
}
