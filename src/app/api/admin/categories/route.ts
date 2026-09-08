import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { categoryInputSchema } from "@/app/api/admin/schemas";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true, products: true } },
    },
  });

  return NextResponse.json({ data: categories }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = categoryInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        parentId: parsed.data.parentId ?? null,
        sortOrder: parsed.data.sortOrder,
        active: parsed.data.active,
      },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error("Category create failed:", error);
    return NextResponse.json(
      { message: "Slug may already be in use" },
      { status: 409 },
    );
  }
}