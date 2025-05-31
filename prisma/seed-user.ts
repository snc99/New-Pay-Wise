import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const firstNames = [
  "Irvan",
  "Sandy",
  "Aldi",
  "Rina",
  "Budi",
  "Citra",
  "Dewi",
  "Fajar",
  "Gita",
  "Hendra",
  "Diana",
  "Eka",
  "Feri",
  "Gani",
  "Hana",
  "Indra",
  "Joko",
];

const lastNames = [
  "Santoso",
  "Pratama",
  "Wijaya",
  "Utomo",
  "Hidayat",
  "Kusuma",
  "Nugroho",
  "Saputra",
  "Putra",
  "Wibowo",
  "Santoso",
  "Pratama",
  "Wijaya",
  "Utomo",
  "Hidayat",
  "Kusuma",
  "Nugroho",
  "Saputra",
  "Putra",
  "Wibowo",
];

async function main() {
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 3) % lastNames.length];

    const fullName = `${firstName} ${lastName} ${i}`;

    await prisma.user.upsert({
      where: { id: `user-${i}` },
      update: {},
      create: {
        id: `user-${i}`,
        name: fullName,
        phone: `0812345678${i.toString().padStart(2, "0")}`,
        address: `Address ${i}`,
      },
    });
  }

  console.log("User seed selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
