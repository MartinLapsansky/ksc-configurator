import React from "react";
import CategoryCard, { CategoryCardItem } from "@/components/commons/CategoryCard";
import TopBanner from "@/components/commons/TopBanner";

const categories: CategoryCardItem[] = [
  {
    id: "jerseys",
    title: "GAA",
    buttonLabel: "Customise",
    href: "/categories/sportswear/jerseys",
  },
  {
    id: "shorts",
    title: "Shorts",
    buttonLabel: "Explore",
    href: "",
  },
  {
    id: "socks",
    title: "ETC.",
    buttonLabel: "Explore",
    href: "",
  },
];

export default function SportswearPage() {
  return (
    <main className="min-w-screen min-h-screen bg-slate-100">
      {/* Top Banner - navigates to home page */}
      <TopBanner />

      <section className="w-full px-4 md:px-8 min-h-[70vh]">
        <CategoryCard cards={categories} />
      </section>
    </main>
  );
}
