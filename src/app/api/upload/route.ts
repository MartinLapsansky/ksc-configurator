import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Missing file upload." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed." },
        { status: 400 },
      );
    }

    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf("."))
      : `.${file.type.split("/")[1] || "png"}`;

    const safeName = sanitizeFileName(file.name.replace(ext, ""));
    const uniqueName = `${safeName}-${Date.now()}${ext}`;

    const blob = await put(uniqueName, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        url: blob.url,
        fileName: uniqueName,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}