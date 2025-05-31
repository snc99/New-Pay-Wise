import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // hash password dulu
  const hashedPassword = await hash("password123", 10); // ganti dengan password default

  // buat superadmin
  await prisma.admin.upsert({
    where: { email: "superadmin@paywise.co.id" },
    update: {},
    create: {
      username: "superadmin",
      email: "superadmin@paywise.co.id",
      name: "Super Admin",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  await prisma.admin.upsert({
    where: { email: "irvan@paywise.co.id" },
    update: {},
    create: {
      username: "irvan23",
      email: "irvan@paywise.co.id",
      name: "Super Admin",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  // buat admin biasa
  await prisma.admin.upsert({
    where: { email: "admin@paywise.co.id" },
    update: {},
    create: {
      username: "admin",
      email: "admin@paywise.co.id",
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
