import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // hash password dulu
  const hashedPassword = await hash("password123", 10); // ganti dengan password default

  // buat superadmin
  await prisma.admin.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      username: "superadmin",
      email: "superadmin@example.com",
      name: "Super Admin",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  // buat admin biasa
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Seed selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
