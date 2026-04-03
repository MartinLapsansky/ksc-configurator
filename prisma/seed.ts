import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";


const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  ),
});

async function main() {

  const hashedPassword = await hash("admin-password-123", 10);

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
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Seeded auth:", user);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });