import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { productInputSchema } from "@/app/api/admin/schemas";
import { CATALOG_CACHE_TAG } from "@/lib/catalog";
import { createProductVersion } from "@/features/admin/services/productVersions";

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
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          categoryId: parsed.data.categoryId,
          active: parsed.data.active,
          sortOrder: parsed.data.sortOrder,
          hasBackView: parsed.data.hasBackView,
          frontImageUrl: parsed.data.frontImageUrl ?? null,
          backImageUrl: parsed.data.backImageUrl ?? null,
          coverImageUrl: parsed.data.coverImageUrl ?? null,
          definition: parsed.data.definition as Prisma.InputJsonValue,
        },
      });

      await createProductVersion(
        {
          productId: created.id,
          slug: created.slug,
          name: created.name,
          categoryId: created.categoryId,
          active: created.active,
          sortOrder: created.sortOrder,
          hasBackView: created.hasBackView,
          frontImageUrl: created.frontImageUrl,
          backImageUrl: created.backImageUrl,
          coverImageUrl: created.coverImageUrl,
          definition: parsed.data.definition as Prisma.InputJsonValue,
          createdBy: admin.id,
        },
        tx,
      );

      return created;
    });

    revalidateTag(CATALOG_CACHE_TAG, { expire: 0 });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("Product create failed:", error);
    return NextResponse.json(
      { message: "Slug may already be in use" },
      { status: 409 },
    );
  }
}