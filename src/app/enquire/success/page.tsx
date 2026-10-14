"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function EnquireSuccessPage() {
  const router = useRouter();

  const handleContinueBrowsing = () => {
    sessionStorage.removeItem("enquirySubmitted");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Enquiry sent successfully
          </h1>

          <p className="text-base text-gray-600">
            Your enquiry was sent successfully, please wait until our sales
            representatives will process this order.
          </p>

          <button
            type="button"
            onClick={handleContinueBrowsing}
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </main>
  );
}