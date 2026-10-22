import {ListBlobResultBlob} from "@vercel/blob";
import {extractBlobPathname, findOrphanedBlobs} from "@/lib/blob/blobCleanup";

function makeBlob(
    pathname: string,
    uploadedAt: Date,
    overrides: Partial<ListBlobResultBlob> = {},
) : ListBlobResultBlob{
    return {
        url: `https://example.blob.vercel-storage.com/${pathname}`,
        pathname,
        uploadedAt,
        size: 100,
        contentType: "image/png",
        downloadUrl: "",
        ...overrides,
    } as ListBlobResultBlob;
}

const HOUR = 60 * 60 * 1000;
const GRACE = 48 * HOUR;

describe("extractBlobPathName", () => {
    it("extracts the pathname from a Vercel Blob URL", () => {
        expect(extractBlobPathname("https://abc123.blob.vercel-storage.com/uploads/logo-1.png",
        )).toBe("uploads/logo-1.png");
    });

    it("strips leading slashes", () => {
        expect(
            extractBlobPathname(
                "https://abc123.blob.vercel-storage.com//uploads/logo-1.png",
            ),
        ).toBe("uploads/logo-1.png");
    });

    it("returns null for a browser blob: URL", () => {
        expect(extractBlobPathname("blob:https://example.com/abc")).toBeNull();
    });

    it("returns null for non-Vercel URLs", () => {
        expect(extractBlobPathname("https://example.com/logo.png")).toBeNull();
    });

    it("returns null for empty/invalid strings", () => {
        expect(extractBlobPathname("")).toBeNull();
        expect(extractBlobPathname("   ")).toBeNull();
        expect(extractBlobPathname("not a url")).toBeNull();
    });
})

describe("findOrphanedBlobs", () => {
    const now = new Date("2026-10-22T09:00:00.000Z").getTime();

    it("keeps referenced blobs regardless of age", () => {
        const old = makeBlob("logo-1.png", new Date(now - 100 * HOUR));
        const referenced = new Set(["logo-1.png"]);

        expect(findOrphanedBlobs([old], referenced, GRACE, now)).toEqual([]);
    });

    it("keeps unreferenced blobs inside the grace period", () => {
        const recent = makeBlob("logo-2.png", new Date(now - 47 * HOUR));

        expect(findOrphanedBlobs([recent], new Set(), GRACE, now)).toEqual([]);
    });

    it("returns unreferenced blobs older than the grace period", () => {
        const old = makeBlob("logo-3.png", new Date(now - 49 * HOUR));
        const result = findOrphanedBlobs([old], new Set(), GRACE, now);

        expect(result.map((b) => b.pathname)).toEqual(["logo-3.png"]);
    });

    it("includes a blob exactly at the grace period boundary as orphaned", () => {
        const boundary = makeBlob("logo-4.png", new Date(now - GRACE));
        const result = findOrphanedBlobs([boundary], new Set(), GRACE, now);

        expect(result.map((b) => b.pathname)).toEqual(["logo-4.png"]);
    });
})

