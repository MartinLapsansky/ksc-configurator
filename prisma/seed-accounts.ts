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
  const seedAdminPassword = process.env.SEED_ACCOUNTS_ADMIN_PASSWORD;
  const seedManagerPassword = process.env.SEED_ACCOUNTS_MANAGER_PASSWORD;

  if (!seedAdminPassword || !seedManagerPassword) {
    throw new Error(
      "SEED_ACCOUNTS_ADMIN_PASSWORD and SEED_ACCOUNTS_MANAGER_PASSWORD must be set",
    );
  }

  const adminPassword = await hash(seedAdminPassword, 10);
  const managerPassword = await hash(seedManagerPassword, 10);

  await prisma.user.upsert({
    where: { email: "mbaca130@gmail.com" },
    update: { name: "Admin", password: adminPassword, role: "admin" },
    create: {
      email: "mbaca130@gmail.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "kcstestcustomizeit@gmail.com" },
    update: { name: "Manager", password: managerPassword, role: "user" },
    create: {
      email: "kcstestcustomizeit@gmail.com",
      password: managerPassword,
      name: "Manager",
      role: "user",
    },
  });

  console.log("Seeded admin and manager accounts.");
}

main()
  .catch((error) => {
    console.error("Seeding accounts failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });