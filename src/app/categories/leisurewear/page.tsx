import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

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
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      {/* Cards Section */}
      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={categories} />
      </section>
    </main>
  );
}
