"use client";

import React from "react";
import ProductItem from "../components/ProductItem";

export default function HomePage() {
  return (
    <main className="min-w-screen min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto">
        <ProductItem />
      </div>
    </main>
  );
}

