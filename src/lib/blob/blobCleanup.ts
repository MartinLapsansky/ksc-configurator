import {del, list, ListBlobResultBlob} from "@vercel/blob";

import {prisma} from "@/lib/prisma";

export const DEFAULT_GRACE_PERIOD_MS = 48 * 60 * 60 * 1000;

export type BlobCleanupResult = {
    totalBlobs: number;
    referencedCount : number;
    deletedCount: number;
    orphanCount: number;
    deletedPathname: string[];
    failedPathname: string[];
}

export async function listAllBlobs(): Promise<ListBlobResultBlob[]>{
    const blobs : ListBlobResultBlob[] = []
    let cursor : string | undefined;

    do {

        const res = await list({cursor, limit: 1000});

        blobs.push(...res.blobs);

        cursor = res.hasMore ? res.cursor : undefined;

    } while (cursor);

    return blobs;
}

export function extractBlobPathname(value: string): string | null {
    if (!value) return null;

    const trimmed = value.trim();

    if (!trimmed || trimmed.startsWith("blob:")) return null;

    let parsed : URL;
    try{
        parsed = new URL(trimmed)
    }
    catch{
        return null;
    }

    if (!parsed.hostname.includes("blob.vercel-storage.com")) return null;

    const pathname = parsed.pathname.replace(/^\/+/, "");
    return pathname || null;
}

function collectStrings(value: unknown, onString: (s: string) => void): void {
    if (typeof value === "string") {
        onString(value);
        return;
    }

    if (Array.isArray(value)) {
        for (const entry of value) collectStrings(entry, onString);
        return;
    }

    if (value && typeof value === "object") {
        for (const entry of Object.values(value)) collectStrings(entry, onString);
    }
}

export async function collectReferencedBlobPathnames(): Promise<Set<string>>{
    const referenced = new Set<string>();

    const record = (value: unknown) => {
        collectStrings(value, (s) => {
            const pathname = extractBlobPathname(s);
            if (pathname) referenced.add(pathname); // add pathname into referenced set
        });
    }

    const [orderItems, products, categories] = await Promise.all([
        prisma.orderItem.findMany({ select: { config: true } }),
        prisma.product.findMany({
            select: {
                definition: true,
                frontImageUrl: true,
                backImageUrl: true,
                coverImageUrl: true,
            },
        }),
        prisma.category.findMany({ select: { coverImageUrl: true } }),
    ])

    for (const item of orderItems) {
        record(item.config)
    }

    for (const product of products) {
        record(product.definition);
            for (const url of [
                product.frontImageUrl,
                product.backImageUrl,
                product.coverImageUrl,
            ]) {
                record(url);
            }
    }

    for (const category of categories) record(category.coverImageUrl);

    return referenced;
}

export function findOrphanedBlobs(blobs: ListBlobResultBlob[], referenced: Set<string>, minAgeMs: number, now = Date.now() ): ListBlobResultBlob[] {
    return blobs.filter(blob => {
        if (referenced.has(blob.pathname)) return false;
        return now - blob.uploadedAt.getTime() >= minAgeMs;
    })
}

export async function deleteOrphanedBlobs(
    blobs: ListBlobResultBlob[],
): Promise<{
    deletedCount: number;
    deletedPathname: string[];
    failedPathname: string[];
}> {
    const deletedPathname: string[] = [];
    const failedPathname: string[] = [];

    for (const blob of blobs) {
        try {
            await del(blob.url);
            deletedPathname.push(blob.pathname);
        } catch (error) {
            console.error("Blob cleanup failed:", blob.pathname, error);
            failedPathname.push(blob.pathname);
        }
    }

    return {
        deletedCount: deletedPathname.length,
        deletedPathname,
        failedPathname,
    };
}

//main cleanup function

export async function runBlobCleanup(options?: {
    minAgeMs?: number;
    now?: Date;
}): Promise<BlobCleanupResult> {
    const minAgeMs = options?.minAgeMs ?? DEFAULT_GRACE_PERIOD_MS;
    const now = options?.now ?? new Date();

    const [blobs, referenced] = await Promise.all([
        listAllBlobs(),
        collectReferencedBlobPathnames(),
    ]);

    const orphans = findOrphanedBlobs(blobs, referenced, minAgeMs, now.getTime());
    const deletion = await deleteOrphanedBlobs(orphans);

    return {
        totalBlobs: blobs.length,
        referencedCount: referenced.size,
        orphanCount: orphans.length,
        ...deletion
    }

}
