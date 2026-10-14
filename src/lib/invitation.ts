import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export const INVITATION_DEFAULT_EXPIRY_DAYS = 7;

export function generateInvitationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Looks up a valid, unused, non-expired invitation by its token.
 * Returns `null` when the invitation cannot be used.
 */
export async function getValidInvitation(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    select: {
      id: true,
      email: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  if (!invitation) return null;
  if (invitation.usedAt) return null;
  if (invitation.expiresAt.getTime() <= Date.now()) return null;

  return invitation;
}

/**
 * Marks an invitation as used. Only succeeds when the invitation is still
 * unused, which prevents a token from being redeemed more than once.
 */
export async function consumeInvitation(token: string): Promise<boolean> {
  const result = await prisma.invitation.updateMany({
    where: {
      token,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  });

  return result.count === 1;
}