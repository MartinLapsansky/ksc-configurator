"use client";

import React from "react";
import Image from "next/image";
import topNavBanner from "@/app/assets/homepage/customize_it_banner.png";
import CategoryCard, { CategoryCardItem } from "@/components/CategoryCard";

const categories: CategoryCardItem[] = [
  {
    id: "hoodies",
    title: "Zip Tops",
    buttonLabel: "Explore",
    href: "/categories/leisurewear/half-zip",
  },
  {
    id: "tracksuits",
    title: "Crew necks",
    buttonLabel: "Explore",
    href: "/categories/leisurewear/crew-neck",
  },
  {
    id: "caps",
    title: "Shorts",
    buttonLabel: "Explore",
    href: "",
  },
];

export default function LeisurewearPage() {
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
        <CategoryCard cards={categories} />
      </section>
    </main>
  );
}
