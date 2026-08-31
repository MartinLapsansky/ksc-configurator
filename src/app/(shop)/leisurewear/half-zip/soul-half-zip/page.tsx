import React from "react";
import HalfZipProductItem from "@/components/screens/halfZip/HalfZipProductItem";
import Breadcrumbs from "@/components/commons/Breadcrumbs";

export default function HalfZipBlackGraphitePage() {
  return (
    <main className="min-h-screen bg-white">
      <Breadcrumbs />

      <div className="p-4 md:p-8">
        <HalfZipProductItem productName="Soul Half Zip" />
      </div>
    </main>
  );
}
