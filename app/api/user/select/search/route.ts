// app/api/user/select/search/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: q === "" ? 7 : undefined, // hanya limit saat tidak search
    });

    const result = users.map((user) => ({
      value: user.id,
      label: user.name,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Gagal ambil data user:", err);
    return NextResponse.json([], { status: 500 });
  }
}
