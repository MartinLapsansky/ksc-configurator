import {NextRequest, NextResponse} from "next/server";

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
    stripeColor: ColorOption;
    brandingColor: ColorOption;
    leftChestLogoUrl?: string;
    sponsorLogoUrl?: string;
    rightLogo: StaticLogoOption;
    backLogoUrl?: string;
    backTextConfig: TextConfig;
    frontTextConfig: TextConfig;
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

       if (form.firstName || form.lastName || form.email || form.phoneNumber || form.organisation || form.quantity) {
           return NextResponse.json({message: "Missing required fields"}, {status: 400});
       }

       if (jerseyConfig){
           return NextResponse.json({error: 'Jersey config is required'},
               {status:400},)
       }

       console.log("Enquiry received:", { form, jerseyConfig });

       return NextResponse.json(
           { message: "Enquiry submitted successfully.", data: { form, jerseyConfig } },
           { status: 200 },
       );

       //to do create enquiry in DB


   } catch (error){
       console.error("Error processing enquiry:", error);
         return NextResponse.json({message: "Internal server error"}, {status: 500});
   }
}

