import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "martin.lapsa2@gmail.com",
    },
    update: {
      name: "Admin",
      password: "admin-password-123",
    },
    create: {
      email: "martin.lapsa2@gmail.com",
      password: "admin-password-123",
      name: "Admin",
    },
  });

  console.log("Seeded user:", user);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });