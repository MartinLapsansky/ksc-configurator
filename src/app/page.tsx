"use client";

import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";
import Breadcrumbs from "@/components/commons/Breadcrumbs";

const cards: CategoryCardItem[] = [
  {
    id: "sports",
    title: "Category: Sports Kit",
    buttonLabel: "Sports Kit",
    href: "/sportswear",
  },
  {
    id: "leisure",
    title: "Category: Leisurewear",
    buttonLabel: "Leisurewear",
    href: "/leisurewear",
  },
];

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-slate-100">
      {/* Top Banner - navigates to home page */}
      <TopBanner />
      <Breadcrumbs />
      {/* Cards Section */}
      <section className="w-full p-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={cards} mobileTwoColumns={false} />
      </section>
    </main>
  );
}
