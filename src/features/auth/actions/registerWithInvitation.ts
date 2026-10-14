"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getValidInvitation, consumeInvitation } from "@/lib/invitation";
import { registerSchema } from "@/features/auth/schemas/registerSchema";

export type RegisterResult = {
  ok: boolean;
  error?: string;
};

/**
 * Creates a `user` account from a valid invitation token.
 *
 * The email is taken from the invitation, so it can never be chosen by the
 * person submitting the form. The invitation is single-use and expires.
 */
export async function registerWithInvitation(
  input: unknown,
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { ok: false, error: firstIssue?.message ?? "Invalid input" };
  }

  const { token, password } = parsed.data;

  const invitation = await getValidInvitation(token);

  if (!invitation) {
    return {
      ok: false,
      error: "Invitation link is invalid or has expired.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      ok: false,
      error: "An account with this email already exists.",
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        role: "user",
      },
    });
  } catch (error) {
    console.error("User creation failed:", error);
    return { ok: false, error: "Account creation failed." };
  }

  const consumed = await consumeInvitation(token);

  if (!consumed) {
    // The account was created but the token could not be marked as used.
    // This is a defensive edge case; log it loudly for visibility.
    console.error(
      `Failed to consume invitation token for ${invitation.email}.`,
    );
  }

  return { ok: true };
}