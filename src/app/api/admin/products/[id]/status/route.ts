import {NextRequest, NextResponse} from "next/server";
import {requireAdmin} from "@/lib/adminAuth";
import {prisma} from "@/lib/prisma";
import {revalidateTag} from "next/cache";
import {CATALOG_CACHE_TAG} from "@/lib/catalog";
import {statusUpdateSchema} from "@/app/api/admin/schemas";

type Params = { params: Promise<{ id: string }> };


export async function PATCH(req: NextRequest, {params} : Params){

    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({message: "Forbidden"}, {status: 403});
    }

    const {id} = await params;
    const body: unknown = await req.json();
    const parsed = statusUpdateSchema.safeParse(body);

    if(!parsed.success){
        return NextResponse.json(
            {message: "Invalid input", issues: parsed.error},
            {status: 400}
        )
    }

    try {
        const product = await prisma.product.update({
            where: {id},
            data: {active: parsed.data.active},
        });

        revalidateTag(CATALOG_CACHE_TAG, {expire: 0});
        return NextResponse.json({data: product}, {status:200})
    } catch (error){
        console.error("Product update failed:", error)
        return NextResponse.json(
            { message: "Update failed" },
            { status: 409 },
        )
    }
}