// GET semua user dan POST user baru

import prisma from "@/lib/prisma"; // sesuaikan path
import { userSchema } from "@/lib/validation-zod/user";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 7;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              phone: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              address: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors[0];
      return NextResponse.json(
        {
          success: false,
          message: errorMessage.message,
        },
        { status: 400 }
      );
    }

    const { name, phone, address } = parsed.data;

    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        address,
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: "User berhasil dibuat",
        data: newUser,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat user." },
      { status: 500 }
    );
  }
}
