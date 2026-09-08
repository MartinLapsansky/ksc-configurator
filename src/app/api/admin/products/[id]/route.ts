import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { productInputSchema } from "@/app/api/admin/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: product }, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: unknown = await req.json();
  const parsed = productInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        categoryId: parsed.data.categoryId,
        active: parsed.data.active,
        sortOrder: parsed.data.sortOrder,
        hasBackView: parsed.data.hasBackView,
        frontImageUrl: parsed.data.frontImageUrl ?? null,
        backImageUrl: parsed.data.backImageUrl ?? null,
        definition: parsed.data.definition as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error) {
    console.error("Product update failed:", error);
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Product delete failed:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 409 },
    );
  }
}