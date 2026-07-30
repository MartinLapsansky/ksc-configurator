"use client";

import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";
import CategoryCard, { CategoryCardItem } from "@/components/CategoryCard";

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
      {/* Top Banner - 30% of viewport height */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <Image
          className="object-cover"
          src={topNavBanner}
          alt="Top banner"
          fill
          priority
          sizes="100vw"
        />
      </div>

      {/* Cards Section */}
      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={cards} />
      </section>
    </main>
  );
}
