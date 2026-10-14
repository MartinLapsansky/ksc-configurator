import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { generateInvitationToken, INVITATION_DEFAULT_EXPIRY_DAYS } from "@/lib/invitation";
import { sendInvitationEmail } from "@/lib/email";

const APP_URL = process.env.APP_URL ?? "https://customizeit.kcsports.ie";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error("Usage: npm run invite:user -- <email> [expiryDays]");
    process.exit(1);
  }

  const expiryDaysArg = Number(process.argv[3]);
  const expiryDays =
    Number.isFinite(expiryDaysArg) && expiryDaysArg > 0
      ? Math.floor(expiryDaysArg)
      : INVITATION_DEFAULT_EXPIRY_DAYS;

  const token = generateInvitationToken();
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  await prisma.invitation.upsert({
    where: { email },
    update: {
      token,
      expiresAt,
      usedAt: null,
    },
    create: {
      email,
      token,
      expiresAt,
    },
  });

  const link = `${APP_URL}/register/${token}`;

  const sent = await sendInvitationEmail({ email, link });

  console.log(`Invitation created for ${email}`);
  console.log(`Expires in ${expiryDays} day(s) (${expiresAt.toISOString()})`);
  console.log(`Link: ${link}`);
  console.log(sent ? "Invitation email sent." : "Invitation email NOT sent (see errors above).");
}

main()
  .catch((error) => {
    console.error("Invitation failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });