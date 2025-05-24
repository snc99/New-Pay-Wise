import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { userSchema } from "@/lib/validation-zod/user-schema";

const prisma = new PrismaClient();

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

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validasi gagal",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, address } = validation.data;

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        address,
      },
    });

    return NextResponse.json({
      message: "User berhasil ditambahkan",
      data: user,
    });
  } catch (error) {
    console.error("[USER_POST]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan di server" },
      { status: 500 }
    );
  }
}
