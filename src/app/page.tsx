"use client";

import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

const cards: CategoryCardItem[] = [
  {
    id: "sports",
    title: "Category: Sports Kit",
    buttonLabel: "Sports Kit",
    href: "/categories/sportswear",
  },
  {
    id: "leisure",
    title: "Category: Leisurewear",
    buttonLabel: "Leisurewear",
    href: "/categories/leisurewear",
  },
];

export default function HomePage() {
  return (
    <main className="min-w-screen min-h-screen bg-slate-100">
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      {/* Cards Section */}
      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={cards} />
      </section>
    </main>
  );
}
