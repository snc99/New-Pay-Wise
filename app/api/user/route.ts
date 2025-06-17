import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/validation-zod/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
    });

    const totalUsers = await prisma.user.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("[GET /user]", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: parsed.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User berhasil ditambahkan",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /user]", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "ID tidak ditemukan" },
//         { status: 400 }
//       );
//     }

//     const requestData = await req.json();
//     const parsed = await userSchema.safeParseAsync({ ...requestData, id });

//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validasi gagal",
//           errors: parsed.error.flatten(),
//         },
//         { status: 400 }
//       );
//     }

//     const existingUser = await prisma.user.findUnique({ where: { id } });

//     if (!existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: parsed.data,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "User berhasil diperbarui",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("[PUT /user/:id]", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Terjadi kesalahan saat memperbarui user",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "ID tidak ditemukan" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await prisma.user.findUnique({ where: { id } });

//     if (!existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     await prisma.user.delete({ where: { id } });

//     return NextResponse.json({
//       success: true,
//       message: "User berhasil dihapus",
//     });
//   } catch (error) {
//     console.error("[DELETE /user/:id]", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Terjadi kesalahan saat menghapus user",
//       },
//       { status: 500 }
//     );
//   }
// }
