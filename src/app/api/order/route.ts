import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

interface ColorOption {
    name: string;
    hex: string;
}

interface StaticLogoOption {
    name: string;
    src: string;
}

interface TextConfig {
    enabled: boolean;
    text: string;
    color: ColorOption;
}

interface JerseyConfig {
    bgColor: ColorOption;
    stripeColor?: ColorOption;
    brandingColor?: ColorOption;
    leftChestLogoUrl?: string;
    sponsorLogoUrl?: string;
    rightLogo?: StaticLogoOption;
    backLogoUrl?: string;
    backTextConfig?: TextConfig;
    frontTextConfig?: TextConfig;
}

interface EnquiryFormState {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    organisation: string;
    quantity: string;
    leadTime: string;
    message: string;
}

interface EnquiryRequestBody {
    form: EnquiryFormState;
    jerseyConfig: JerseyConfig;
}

export async function POST(req: NextRequest){

   try{
       const body = (await req.json()) as EnquiryRequestBody;

       const {form, jerseyConfig} = body;

       const session = await getServerSession(authOptions);

       // if (!session?.user?.id) {
       //     return NextResponse.json(
       //         { message: "Unauthorized" },
       //         { status: 401 },
       //     );
       // }


       if (
           !form?.firstName ||
           !form?.lastName ||
           !form?.email ||
           !form?.phoneCountryCode ||
           !form?.phoneNumber ||
           !form?.organisation ||
           !form?.quantity ||
           !form?.leadTime ||
           !form?.message
       ) {
           return NextResponse.json(
               { message: "Missing required fields" },
               { status: 400 },
           );
       }

       if (!jerseyConfig) {
           return NextResponse.json(
               { message: "Jersey config is required" },
               { status: 400 },
           );
       }

       const createdOrder = await prisma.order.create({
           data: {
               firstName: form.firstName.trim(),
               lastName: form.lastName.trim(),
               email: form.email.trim().toLowerCase(),
               phoneCountryCode: form.phoneCountryCode.trim(),
               phoneNumber: form.phoneNumber.trim(),
               organisation: form.organisation.trim(),
               quantity: Number(form.quantity),
               leadTime: form.leadTime.trim(),
               message: form.message.trim(),
               jerseyConfig: JSON.parse(JSON.stringify(jerseyConfig)) as Prisma.InputJsonValue,
               userId: session?.user?.id ?? null,
           },
       });

       return NextResponse.json(
           {
               message: "Order submitted successfully.",
               data: createdOrder,
           },
           { status: 201 },
       );


   } catch (error){
       console.error("Error processing order:", error);
       return NextResponse.json(
           { message: "Internal server error" },
           { status: 500 },
       );
   }
}


export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ data: orders }, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}



