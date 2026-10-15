import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getFileNameFromUrl(url: string): string {
    try {
        const { pathname } = new URL(url);
        const fileName = pathname.split("/").pop();

        return fileName || "image";
    } catch {
        return "image";
    }
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            { message: "Missing image URL." },
            { status: 400 },
        );
    }

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(url);
    } catch {
        return NextResponse.json(
            { message: "Invalid image URL." },
            { status: 400 },
        );
    }

    if (
        parsedUrl.protocol !== "https:" ||
        !parsedUrl.hostname.endsWith(".public.blob.vercel-storage.com")
    ) {
        return NextResponse.json(
            { message: "Image URL is not allowed." },
            { status: 400 },
        );
    }

    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
        return NextResponse.json(
            { message: "Failed to fetch image." },
            { status: 502 },
        );
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const fileName = getFileNameFromUrl(parsedUrl.toString());
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${fileName}"`,
        },
    });
}