import React from "react";
import JerseyProductItem from "@/features/configurator/components/productItems/JerseyProductItem";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function JerseyDesign146Page() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Breadcrumbs />

      <div className="p-4 md:p-8">
        <JerseyProductItem productName="Jersey Design 146" />
      </div>
    </main>
  );
}
