import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const versions = await prisma.productVersion.findMany({
    where: { productId: id },
    orderBy: { version: "desc" },
    include: {
      createdByUser: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ data: versions }, { status: 200 });
}
