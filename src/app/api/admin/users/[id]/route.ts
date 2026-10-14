import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { userCountiesSchema } from "@/app/api/admin/schemas";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: unknown = await req.json();
  const parsed = userCountiesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { counties: parsed.data.counties },
      select: { id: true, email: true, name: true, role: true, counties: true },
    });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error("User counties update failed:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 409 });
  }
}