import {NextResponse, NextRequest} from "next/server";
import {runBlobCleanup} from "@/lib/blob/blobCleanup";


export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;

    if(!secret){
        console.error("CRON_SECRET is not set");
        return NextResponse.json({message: "Unauthorized"}, {status:401})
    }

    const authorization = request.headers.get("Authorization");
    const expectedSecret = `Bearer ${secret}`;

    if (authorization !== expectedSecret){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try{
        const result = await runBlobCleanup()
        return NextResponse.json({message: "Cleanup completed",...result}, {status: 200})
    } catch(error){
        console.error("Error during cleanup:", error);
        return NextResponse.json({message:"Cleanup failed"}, {status:500})

    }
}