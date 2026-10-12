import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";

const deleteBlobSchema = z.object({
  url: z.string().min(1),
});

/**
 * Deletes a single uploaded image from Vercel Blob storage. Admin-only; used
 * by the admin product form to remove accidentally uploaded assets.
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = deleteBlobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    await del(parsed.data.url);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Blob delete failed:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}