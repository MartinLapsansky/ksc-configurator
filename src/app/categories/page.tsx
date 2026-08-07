import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

const categories: CategoryCardItem[] = [
  {
    id: "gaa",
    title: "GAA",
    buttonLabel: "Explore",
    href: "/enquire",
  },
  {
    id: "shorts",
    title: "Shorts",
    buttonLabel: "Explore",
    href: "/enquire",
  },
  {
    id: "etc",
    title: "Etc.",
    buttonLabel: "Explore",
    href: "/enquire",
  },
];

export default function CategoriesPage() {
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
