import React from "react";
import JerseyProductItem from "@/components/screens/jersey/JerseyProductItem";
import Breadcrumbs from "@/components/commons/Breadcrumbs";

export default function JerseyDesign146Page() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Breadcrumbs />

      <div className="p-4 md:p-8">
        <JerseyProductItem />
      </div>
    </main>
  );
}
