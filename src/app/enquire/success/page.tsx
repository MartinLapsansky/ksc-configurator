"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";

const ENQUIRY_SUBMITTED_KEY = "enquirySubmitted";
const ENQUIRY_SUCCESS_KEY = "enquirySuccess";

type EnquirySuccessData = {
  firstName: string;
  lastName: string;
  orderNumber: number;
};

function readEnquirySuccess(): EnquirySuccessData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(ENQUIRY_SUCCESS_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as EnquirySuccessData;
  } catch {
    return null;
  }
}

export default function EnquireSuccessPage() {
  const router = useRouter();
  const [successData] = useState<EnquirySuccessData | null>(() =>
    readEnquirySuccess(),
  );

  const customerName =
    [successData?.firstName, successData?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  const handleContinueBrowsing = () => {
    sessionStorage.removeItem(ENQUIRY_SUBMITTED_KEY);
    sessionStorage.removeItem(ENQUIRY_SUCCESS_KEY);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Enquiry sent successfully
          </h1>

          <div className="space-y-4 text-base text-gray-600">
            <p>Hi {customerName},</p>

            <p>
              Thank you for submitting your quote request through Customizeit.
              {successData?.orderNumber
                ? ` Your reference number is ${successData.orderNumber}.`
                : ""}
            </p>

            <p>
              Our sales team is currently reviewing your request and will be in
              contact shortly.
            </p>

            <p>
              Kind regards,
              <br />
              The KCS Sales Team
            </p>
          </div>

          <Button type="button" onClick={handleContinueBrowsing} size="sm">
            Continue browsing
          </Button>
        </div>
      </div>
    </main>
  );
}