import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

async function main() {
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!seedAdminPassword) {
    throw new Error(
      "SEED_ACCOUNTS_ADMIN_PASSWORD and SEED_ACCOUNTS_MANAGER_PASSWORD must be set",
    );
  }

  const adminPassword = await hash(seedAdminPassword, 10);

  await prisma.user.upsert({
    where: { email: "martin.lapsa2@gmail.com" },
    update: { name: "Admin", password: adminPassword, role: "admin" },
    create: {
      email: "martin.lapsa2@gmail.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Seeded admin account.");
}

main()
  .catch((error) => {
    console.error("Seeding accounts failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });