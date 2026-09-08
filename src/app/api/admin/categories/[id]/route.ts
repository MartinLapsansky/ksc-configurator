import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { categoryInputSchema } from "@/app/api/admin/schemas";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: unknown = await req.json();
  const parsed = categoryInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        parentId: parsed.data.parentId ?? null,
        sortOrder: parsed.data.sortOrder,
        active: parsed.data.active,
      },
    });

    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    console.error("Category update failed:", error);
    return NextResponse.json(
      { message: "Update failed (slug may be in use)" },
      { status: 409 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Category delete failed:", error);
    return NextResponse.json(
      { message: "Delete failed (category may have children/products)" },
      { status: 409 },
    );
  }
}