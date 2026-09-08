import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { productInputSchema } from "@/app/api/admin/schemas";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json({ data: products }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = productInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.create({
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

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("Product create failed:", error);
    return NextResponse.json(
      { message: "Slug may already be in use" },
      { status: 409 },
    );
  }
}